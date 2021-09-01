import * as Notifications from "expo-notifications";
import firebase from 'firebase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { GlobalContext } from '../components/context';
import { firestore, GeoFirestore } from '../config/firebase';
import config from "../env";
import { distanceBetweenTwoCoordinates, isCurrentJobCreatedByUser, sortJobsByProximity } from "../functions";
import { USER_LOCATION_CONTEXT } from './userLocation';

export const JOB_CONTEXT = createContext({ preferredSkills: [] });

const JOBS_DB = firestore.collection('jobs');

const useNotificationResponse = () => {
    const lastNotification = Notifications.useLastNotificationResponse();
    const [lastNotificationID, setLastNotificationID] = useState(null)

    useEffect(() => {
        if (lastNotification) {
            setLastNotificationID(lastNotification?.notification.request.identifier)
        }
    }, [lastNotification])

    return { lastNotification: lastNotification?.notification.request.identifier === lastNotificationID ? null : lastNotification }
}

export const JobContextProvider = (props) => {
    const { authState } = useContext(GlobalContext)
    const { location } = useContext(USER_LOCATION_CONTEXT)
    const [preferredSkills, _setPreferredSkills] = useState([]);
    const [current, setCurrent] = useState()
    const [jobs, setJobs] = useState([])
    const [viewed, setViewed] = useState([])
    const [ready, setReady] = useState(false);
    const radius = 100; // "Miles". Replace this with the value from user settings
    const { lastNotification } = useNotificationResponse();
    const { hasActiveAccount } = useSelector((state) => state.payment)

    useEffect(() => {
        fetchSkills()
    }, [])

    /**
     * Upon app load, check if there is any active job.
     * If there is a job, set the current job, else fetch all available jobs or check notification.
     * 
     * Set this context as ready when done.
     */
    useEffect(() => {
        let unsubscribe;

        if (!authState.userID || authState?.userData?.role !== "contractor") return;
        try {
            unsubscribe = JOBS_DB.where("status", "in", ["in progress", "in review", "accepted"])
                .where("executed_by", "==", authState.userID)
                .limit(1).onSnapshot((snap) => {
                    if (!snap.empty) {
                        snap.docs.forEach(doc => {
                            const data = doc.data()
                            data._id = doc.id
                            data.id = doc.id
                            setCurrent(data)
                            setViewed([...viewed, data._id])
                        })
                    } else {
                        setCurrent(null)
                    }
                    setReady(true)
                })
        } catch (e) {
            console.log(e.message)
        }
        return () => {
            if (unsubscribe) unsubscribe()
            setCurrent(null)
        }
    }, [authState?.userData?.role])

    useEffect(() => {
        let unsubscribe;

        fetchJobsAndNotification()
            .then(unsub => unsubscribe = unsub)

        return () => {
            if (unsubscribe) unsubscribe()
            setJobs([])
        }
    }, [location, authState?.userData?.role, ready, current, lastNotification?.notification?.request?.identifier])


    const fetchJobsAndNotification = async () => {

        /**
         * Check if a new notification has been interacted with and get the job
         */
        if (authState.userData.role === 'contractor' && lastNotification && (ready && !current)) {
            const { type, id, sender } = lastNotification.notification.request.content.data
            console.log(lastNotification, "last notification")
            await Notifications.dismissAllNotificationsAsync()

            if (lastNotification.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER && authState.userID !== sender) {
                switch (type) {
                    case "jobcreated":
                        // Update the job only if it has not been matced with another deployee
                        const doc = JOBS_DB.doc(id);
                        const snap = await doc.get({ source: 'server' })
                        const job_found = snap.data()
                        if (snap.exists && !job_found.executed_by) {
                            if (job_found?.inAppPayment && !hasActiveAccount) {
                                Alert.alert("Payment Account Required", "You must setup your account to view this job",
                                    [{
                                        text: 'Cancel',
                                        style: 'cancel',
                                    }])
                            } else {
                                console.log("Selected job based on proximity")
                                await doc.update({
                                    status: "in review",
                                    executed_by: authState.userID,
                                })
                            }
                            return
                        }
                        break;
                }
            }
        }
        /**
         * If the logged in user is a contractor and active jobs have already been fetched,
         * subscribe to list of available jobs.
         * 
         * Before subscription, check if there is any current job.
         */
        if (authState.userData.role === 'contractor' && location && (ready && !current)) {
            const { latitude, longitude } = location.coords;
            const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference

            // Queries
            const query = geoCollection
                .near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: radius })
                .where("status", "==", "available");

            // ** Subscribe, add jobs into store and listen for changes **
            // This function returns an unsubscribe function to close this listener
            let unsubscribe = query.onSnapshot((res) => {
                const jobList = [];
                res.forEach((snap) => {
                    const data = snap.data();
                    if (isCurrentJobCreatedByUser(data, preferredSkills, authState.userID)) {
                        return;
                    }
                    if (viewed.find(item => snap.id === item)) {
                        return
                    }
                    data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
                    data._id = snap.id;
                    jobList.push(data)
                })
                setJobs(jobList)
            });

            return unsubscribe;
        }
    }

    const fetchSkills = async () => {
        try {
            const apiResponse = await fetch(`${config.API_URL}/users/${authState.userID}`, {
                method: "GET",
                headers: {
                    Authorization: `bearer ${authState.userToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!apiResponse.ok) {
                throw new Error((await apiResponse.json()).message || "Failed to send new jobs");
            }
            const userData = await apiResponse.json()
            _setPreferredSkills(userData.skills)
        } catch (e) {
            console.log(e)
        }
    }

    const updateLiveLocation = async (jobID, longitude, latitude) => {
        try {
            const doc = JOBS_DB.doc(jobID)
            await doc.update({
                active_location: {
                    user: authState.userID,
                    id: current.id,
                    longitude,
                    latitude
                }
            })
            console.log("Updating live location")
        } catch (e) {
            console.log(e.message)
        }
    }

    const findFirstJobWithKeyword = (searched_Keywords = "") => {
        if (!searched_Keywords) {
            return;
        }
        const filteredJobs = jobs.filter((job) => job?.job_type?.toLowerCase().startsWith(searched_Keywords.trim().toLowerCase()) && !viewed.find(id => id === job._id));
        const sortedJob = sortJobsByProximity(filteredJobs, (a, b) => a.distance - b.distance)[0];
        if (sortedJob) {
            setViewed([...viewed, sortedJob._id])
        }
        return sortedJob;
    };

    const setPreferredSkills = async (preferredSkills) => {
        if (!preferredSkills || preferredSkills.length > 10) {
            throw new Error('You can select at most 10 skills')
        }
        if (!authState.userID) {
            throw new Error('Failed to update preferred skills')
        }

        const apiResponse = await fetch(`${config.API_URL}/users/saveSkills`, {
            method: "POST",
            headers: {
                Authorization: `bearer ${authState.userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                skills: preferredSkills
            }),
        });
        if (!apiResponse.ok) {
            throw new Error((await apiResponse.json()).message || "Failed to save skills");
        }
        _setPreferredSkills(preferredSkills)
        return true;
    };

    const getCompletedJobs = async () => {
        const query = JOBS_DB
            .where("executed_by", "==", authState.userID)
            .where("status", "in", ["complete", "disputed"])
            .orderBy("date_created", "desc");

        const jobs = [];
        const doc = await query.get()
        doc.forEach((snap) => {
            jobs.push({ ...snap.data(), id: snap.id, _id: snap.id });
        });
        return jobs;
    };

    return (
        <JOB_CONTEXT.Provider value={{
            current, setCurrent, ready, updateLiveLocation,
            preferredSkills, findFirstJobWithKeyword, getCompletedJobs,
            setPreferredSkills, jobs, setJobs, setViewed, viewed,
        }}>
            {props.children}
        </JOB_CONTEXT.Provider>
    );
};

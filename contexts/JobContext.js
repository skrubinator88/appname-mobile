import firebase from 'firebase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../components/context';
import { firestore, GeoFirestore } from '../config/firebase';
import { distanceBetweenTwoCoordinates, isCurrentJobCreatedByUser, sortJobsByProximity } from "../functions";
import { USER_LOCATION_CONTEXT } from './userLocation';


export const JOB_CONTEXT = createContext({ preferredSkills: [] });

const JOBS_DB = firestore.collection('jobs');

export const JobContextProvider = (props) => {
    const { authState } = useContext(GlobalContext)
    const { location } = useContext(USER_LOCATION_CONTEXT)
    const [preferredSkills, _setPreferredSkills] = useState([
        "Healthcare professionals",
        "Snow and Ice Removal",
        "HVAC (Heating & Air Conditioning)",
    ]);
    const [current, setCurrent] = useState()
    const [jobs, setJobs] = useState([])
    const [viewed, setViewed] = useState([])
    const [ready, setReady] = useState(false);
    const radius = 100; // "Miles". Replace this with the value from user settings

    useEffect(() => {
        // Fetch preferred skills
        firestore.collection("preferredSkills").doc(authState.userID).get().then(snap => {
            if (!snap.exists) {
                return
            }
            const data = snap.data()
            if (data.preferredSkills.length < 1) { return }
            _setPreferredSkills(data.preferredSkills)
        }).catch(e => console.log(e));
    }, [])

    /**
     * Upon app load, check if there is any active job.
     * If there is a job, set the current job, else fetch all available jobs.
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
            unsubscribe = query.onSnapshot((res) => {
                const jobList = [];
                res.forEach((snap) => {
                    const data = snap.data();
                    if (isCurrentJobCreatedByUser(data, preferredSkills, authState.userID)) {
                        return;
                    }
                    data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
                    data._id = snap.id;
                    jobList.push(data)
                })
                setJobs(jobList)
            });
        }
        return () => {
            if (unsubscribe) unsubscribe()
            setJobs([])
        }
    }, [location, authState?.userData?.role, ready, current])

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
        if (!preferredSkills || preferredSkills.length !== 3) {
            throw new Error('You must select 3 preferred skills')
        }
        if (!authState.userID) {
            throw new Error('Failed to update preferred skills for user')
        }
        await firestore.collection("preferredSkills").doc(authState.userID).set({ preferredSkills });
        _setPreferredSkills(preferredSkills)
    };


    return (
        <JOB_CONTEXT.Provider value={{
            current, setCurrent, ready,
            preferredSkills, findFirstJobWithKeyword,
            setPreferredSkills, jobs, setJobs,
        }}>
            {props.children}
        </JOB_CONTEXT.Provider>
    );
};

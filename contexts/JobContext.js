import AsyncStorage from "@react-native-community/async-storage";
import firebase from 'firebase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../components/context';
import { firestore, GeoFirestore } from '../config/firebase';
import { distanceBetweenTwoCoordinates, isCurrentJobCreatedByUser, sortJobsByProximity } from "../functions";
import { USER_LOCATION_CONTEXT } from './userLocation';


export const JOB_CONTEXT = createContext({ preferredSkills: [] });

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

    useEffect(() => {
        let unsubscribe

        if (authState.userData.role === 'contractor' && location) {
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
    }, [location, authState?.userData?.role])

    useEffect(() => {
        (async () => {
            try {
                const existingJob = JSON.parse(await AsyncStorage.getItem(`app.job.current.${authState.userID}`))
                if (existingJob) {
                    setViewed([...viewed, existingJob._id])
                    setCurrent(existingJob)
                }
            } catch (e) {
                console.log(e.message)
            }
        })()
    }, [location, authState?.userData?.role])

    useEffect(() => {
        let unsubscribe
        if (current) {
            unsubscribe = firestore.collection('jobs').doc(current._id).onSnapshot(async (snap) => {
                if (snap.exists) {
                    const data = snap.data()
                    data._id = snap.id
                    data.id = snap.id
                    if (data.executed_by && authState.userID !== data.executed_by) {
                        AsyncStorage.removeItem(`app.job.current.${authState.userID}`)
                        setCurrent(null)
                    }
                    if (data.status === 'complete' || data.status === 'available') {
                        AsyncStorage.removeItem(`app.job.current.${authState.userID}`)
                        setCurrent(null)
                        return
                    }
                    setCurrent(data)
                } else {
                    if (unsubscribe) unsubscribe()
                    AsyncStorage.removeItem(`app.job.current.${authState.userID}`)
                    setCurrent(null)
                }
            })
        }
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [current?._id])


    const findFirstJobWithKeyword = (searched_Keywords = "", userID = "") => {
        if (!searched_Keywords) {
            return;
        }
        const filteredJobs = jobs.filter((job) => job?.job_type?.toLowerCase().startsWith(searched_Keywords.trim().toLowerCase()) && !viewed.find(id => id === job._id));
        const sortedJob = sortJobsByProximity(filteredJobs, (a, b) => a.distance - b.distance)[0];
        if (sortedJob) {
            setViewed([...viewed, sortedJob._id])
            // Set the current job for later retrieval
            AsyncStorage.setItem(`app.job.current.${authState.userID}`, JSON.stringify(sortedJob))
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
            current, setCurrent,
            preferredSkills, findFirstJobWithKeyword,
            setPreferredSkills, jobs, setJobs,
        }}>
            {props.children}
        </JOB_CONTEXT.Provider>
    );
};

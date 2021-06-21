import React, { createContext, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../components/context';
import { firestore, GeoFirestore } from '../config/firebase';
import { sortJobsByProximity } from "../functions";
import jobList from "../models/fetchedSuggestedItems"

export const JOB_CONTEXT = createContext({ preferredSkills: [] });


export const JobContextProvider = (props) => {
    const { authState } = useContext(GlobalContext)
    const [viewed, setViewed] = useState();
    const [preferredSkills, _setPreferredSkills] = useState([
        "Healthcare professionals",
        "Snow and Ice Removal",
        "HVAC (Heating & Air Conditioning)",
    ]);
    const [current, setCurrent] = useState()

    useEffect(() => {
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
        if (current) {
            unsubscribe = firestore.collection('jobs').doc(current._id).onSnapshot(snap => {
                if (snap.exists) {
                    const data = snap.data()
                    data._id = snap.id
                    setCurrent(data)
                } else {
                    if (unsubscribe) unsubscribe()
                    setCurrent(null)
                }
            })
        }
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [current?._id])


    const findFirstJobWithKeyword = (searched_Keywords = "", jobs, userID = "") => {
        if (!searched_Keywords) {
            return;
        }
        const jobsFound = jobs.filter((job) => job?.job_type?.toLowerCase().startsWith(searched_Keywords.trim().toLowerCase()) && (!viewed || job._id !== viewed));
        return sortJobsByProximity(jobsFound, (a, b) => a.distance - b.distance)[0];
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
            viewed, setViewed,
            preferredSkills, findFirstJobWithKeyword,
            setPreferredSkills
        }}>
            {props.children}
        </JOB_CONTEXT.Provider>
    );
};

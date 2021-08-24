import React, { createContext, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../components/context';
import { firestore } from "../config/firebase";
import config from "../env";
import { handleCameraCoordinates } from "../controllers/MapController";
import { useDispatch } from 'react-redux';

export const LISTING_CONTEXT = createContext({ listing: null });

const JOBS_DB = firestore.collection('jobs');

export const ListingContextProvider = (props) => {
    const { authState } = useContext(GlobalContext)
    const [listing, setListing] = useState(null)
    const [ready, setReady] = useState(false);

    const dispatch = useDispatch()

    useEffect(() => {
        let unsubscribe;

        if (!authState.userID || authState?.userData?.role === "contractor") return;

        try {
            unsubscribe = JOBS_DB.where("status", "in", ["available", "in progress", "in review", "accepted"])
                .where("posted_by", "==", authState.userID)
                .limit(1).onSnapshot((snap) => {
                    if (!snap.empty) {
                        snap.docs.forEach(doc => {
                            const data = doc.data()
                            data._id = doc.id
                            data.id = doc.id
                            setListing(data)
                        })
                    } else {
                        setListing(null)
                    }
                    setReady(true)
                })
        } catch (e) {
            console.log(e.message)
        }
        return () => {
            if (unsubscribe) unsubscribe()
            setListing(null)
        }
    }, [authState?.userData?.role])

    useEffect(() => {
        if (listing?._id?.active_location) {
            handleCameraCoordinates(listing?._id?.active_location, dispatch);
        }
    }, [listing?._id?.active_location?.longitude, listing?._id?.active_location?.latitude])

    const broadcastAvailableJobs = async (location, jobID, jobType) => {
        const apiResponse = await fetch(`${config.API_URL}/broadcastAvailableJobs`, {
            method: "POST",
            headers: {
                Authorization: `bearer ${authState.userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                longitude: location?.longitude,
                latitude: location?.latitude,
                jobID,
                jobType
            }),
        });
        if (!apiResponse.ok) {
            throw new Error((await apiResponse.json()).message || "Failed to send new jobs");
        }
        return true;
    }

    return (
        <LISTING_CONTEXT.Provider value={{ listing, setListing, ready, broadcastAvailableJobs }}>
            {props.children}
        </LISTING_CONTEXT.Provider>
    );
};

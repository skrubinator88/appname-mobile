import AsyncStorage from "@react-native-community/async-storage";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { GlobalContext } from '../components/context';
import { firestore } from "../config/firebase";


export const LISTING_CONTEXT = createContext({ job: null });

const JOBS_DB = firestore.collection('jobs');

export const ListingContextProvider = (props) => {
    const { authState } = useContext(GlobalContext)
    const [listing, setListing] = useState(null)
    const [ready, setReady] = useState(false);

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

    return (
        <LISTING_CONTEXT.Provider value={{ listing, setListing, ready }}>
            {props.children}
        </LISTING_CONTEXT.Provider>
    );
};

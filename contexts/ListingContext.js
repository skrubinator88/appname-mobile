import AsyncStorage from "@react-native-community/async-storage";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { GlobalContext } from '../components/context';
import { firestore } from "../config/firebase";


export const LISTING_CONTEXT = createContext({ job: null });

export const ListingContextProvider = (props) => {
    const { authState } = useContext(GlobalContext)
    const [listing, _setListing] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const existingJob = JSON.parse(await AsyncStorage.getItem(`app.listing.current.${authState.userID}`))
                if (existingJob) {
                    _setListing(existingJob)
                }
            } catch (e) {
                console.log(e.message)
            }
        })()
    }, [authState?.userData?.role])

    useEffect(() => {
        let unsubscribe
        if (listing) {
            unsubscribe = firestore.collection('jobs').doc(listing._id).onSnapshot(async (snap) => {
                if (snap.exists) {
                    const data = snap.data()
                    data._id = snap.id
                    data.id = snap.id
                    if (data.posted_by && authState.userID !== data.posted_by) {
                        AsyncStorage.removeItem(`app.listing.current.${authState.userID}`)
                        _setListing(null)
                    }
                    if (data.status === 'complete') {
                        AsyncStorage.removeItem(`app.listing.current.${authState.userID}`)
                        _setListing(null)
                        return
                    }
                    _setListing(data)
                } else {
                    if (unsubscribe) unsubscribe()
                    AsyncStorage.removeItem(`app.listing.current.${authState.userID}`)
                    _setListing(null)
                }
            })
        }
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [listing?._id])


    return (
        <LISTING_CONTEXT.Provider value={{
            listing, setListing: (data) => {
                AsyncStorage.setItem(`app.listing.current.${authState.userID}`, JSON.stringify(data))
                _setListing(data)
            }
        }}>
            {props.children}
        </LISTING_CONTEXT.Provider>
    );
};

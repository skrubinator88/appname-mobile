import AsyncStorage from "@react-native-community/async-storage";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { GlobalContext } from '../components/context';


export const LISTING_CONTEXT = createContext({ job: null });

export const ListingContextProvider = (props) => {
    const { authState } = useContext(GlobalContext)
    const [job, setJob] = useState(null)

    const listing = useSelector((state) => state.listings?.find(item => item._id === job?.id));

    useEffect(() => {
        (async () => {
            try {
                const existingJob = JSON.parse(await AsyncStorage.getItem(`app.listing.current.${authState.userID}`))
                if (existingJob) {
                    setJob(existingJob)
                }
            } catch (e) {
                console.log(e.message)
            }
        })()
    }, [job?._id, authState?.userData?.role])

    return (
        <LISTING_CONTEXT.Provider value={{ listing, setListing: setJob }}>
            {props.children}
        </LISTING_CONTEXT.Provider>
    );
};

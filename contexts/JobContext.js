import React, { useContext, useState } from 'react';
import { sortJobsByProximity } from "../functions";

export const JOB_CONTEXT = useContext();


export const JobContextProvider = (props) => {
    const [viewed, setViewed] = useState([]);
    const findFirstJobWithKeyword = (searched_Keywords = "", jobs, userID = "") => {
        if (!searched_Keywords) {
            return;
        }
        const jobsFound = jobs.filter((job) => job?.job_type?.toLowerCase().startsWith(searched_Keywords.trim().toLowerCase()));
        return sortJobsByProximity(jobsFound, (a, b) => a.distance - b.distance)[0];
    };


    return (
        <JOB_CONTEXT.Provider value={{ viewed, setViewed, findFirstJobWithKeyword }}>
            {props.children}
        </JOB_CONTEXT.Provider>
    );
};

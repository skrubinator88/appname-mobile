import React, { createContext, useState } from 'react';
import { sortJobsByProximity } from "../functions";
import jobList from "../models/fetchedSuggestedItems"

export const JOB_CONTEXT = createContext();


export const JobContextProvider = (props) =>
{
    const [viewed, setViewed] = useState();
    const [preferredSkills, setPreferredSkills] = useState(jobList);
    const findFirstJobWithKeyword = (searched_Keywords = "", jobs, userID = "") =>
    {
        if (!searched_Keywords)
        {
            return;
        }
        const jobsFound = jobs.filter((job) => job?.job_type?.toLowerCase().startsWith(searched_Keywords.trim().toLowerCase()) && (!viewed || job._id !== viewed));
        return sortJobsByProximity(jobsFound, (a, b) => a.distance - b.distance)[0];
    };


    return (
        <JOB_CONTEXT.Provider value={{ viewed, setViewed, preferredSkills, findFirstJobWithKeyword }}>
            {props.children}
        </JOB_CONTEXT.Provider>
    );
};

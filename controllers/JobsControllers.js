// Dependencies
import axios from "axios";
import * as firebase from "firebase";
import "firebase/firestore";
import * as geofirestore from "geofirestore";

// Config
import config from "../env";
import { firebaseConfig } from "../config/firebase";
!firebase.apps.length && firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore(); // Create a Firestore reference
const GeoFirestore = geofirestore.initializeApp(firestore); // Create a GeoFirestore reference

// Functions
import { distanceBetweenTwoCoordinates, sortJobsByProximity } from "../functions";

// Redux Actions
import JobsStoreActions from "../rdx-actions/jobs.action";
import ListingsActions from "../rdx-actions/listings.action";
const Actions = { JobsStoreActions, ListingsActions };

exports.getJobsAndSubscribeJobsChannel = (state, dispatch) => {
  // State
  const { location, setLocation } = state;
  const { setError } = state;
  let { radius } = state; // in Miles
  const { latitude, longitude } = location.coords; // User Location

  radius = 10; // "Miles". Replace this with the value from user settings

  if (location != null) {
    const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference

    // Queries
    const query = geoCollection
      .near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: radius })
      .where("status", "==", "available");

    // ** Subscribe, add jobs into store and listen for changes **
    // This function returns an unsubscribe function to close this listener
    const unsubscribe = query.onSnapshot((res) => {
      res.docChanges().forEach((change) => {
        const { doc: document } = change;
        switch (change.type) {
          case "added": {
            const data = document.data();
            data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
            return dispatch(JobsStoreActions.add(document.id, data));
          }
          case "modified": {
            const data = document.data();
            data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
            return dispatch(JobsStoreActions.update(document.id, data));
          }
          case "removed": {
            return dispatch(JobsStoreActions.remove(document.id));
          }
          default:
            break;
        }
      });
    });

    return unsubscribe;
  }
};

exports.currentUserActiveJobs = (userID, dispatch) => {
  const query = GeoFirestore.collection("jobs")
    .where("posted_by", "==", userID)
    .where("status", "in", ["available", "in review", "in progress"]);

  const unsubscribe = query.onSnapshot((res) => {
    res.docChanges().forEach((change) => {
      const { doc: document } = change;
      switch (change.type) {
        case "added": {
          return dispatch(ListingsActions.add(document.id, document.data()));
        }
        case "modified": {
          return dispatch(ListingsActions.update(document.id, document.data()));
        }
        // case "removed": {
        //   return setInProgressJobs({ id: document.id, type: "removed" });
        // }
        default:
          break;
      }
    });
  });

  return unsubscribe;
};

exports.getJobTagType = (imageType) => {
  switch (imageType) {
    case "user":
      return require("../assets/user-icon2.png");
      break;
  }
};

exports.clean = (ProviderName, unsubscribe, dispatch) => {
  if (unsubscribe) {
    unsubscribe(); // Unsubscribe from firebase
  }

  if (dispatch) dispatch(Actions[ProviderName].clear()); // Clear state
};

exports.findFirstJobWithKeyword = (searched_Keywords, jobs) => {
  const jobsFound = jobs.filter((job) => job?.job_type === searched_Keywords);
  return sortJobsByProximity(jobsFound, (a, b) => a.distance - b.distance)[0];
};

exports.changeJobStatus = async (documentID, status) => {
  const geoCollection = GeoFirestore.collection("jobs").doc(documentID);

  // Update job status
  geoCollection.update({ status });
};

exports.currentUserJobsHistory = (user) => {};

exports.postUserJob = async (userID, job) => {
  if (!userID) throw new Error("User ID is required");
  if (!job) throw new Error("A job is required");

  const newJob = {
    posted_by: userID,
    date_created: new Date(),
    date_completed: null,
    star_rate: null,
    status: "available",
    ...job,
  };

  const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference
  const { coordinates } = newJob;
  const GeoPoint = new firebase.firestore.GeoPoint(...coordinates);
  return geoCollection
    .add({ ...newJob, coordinates: GeoPoint })
    .then((docRef) => {
      return new Promise((resolution, rejection) => {
        resolution({ success: true });
      });
    })
    .catch((error) => {
      return new Promise((resolution, rejection) => {
        rejection({ success: false, error: error.message });
      });
    });

  // Test
};

exports.updateUserJob = (userID, jobID, updatedJob) => {
  if (!userID) throw new Error("User ID is required");
};

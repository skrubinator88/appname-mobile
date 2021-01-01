// Dependencies
import axios from "axios";
import * as firebase from "firebase";

// Config
import config from "../env";
import { firestore, GeoFirestore } from "../config/firebase";

// Functions
import { distanceBetweenTwoCoordinates, sortJobsByProximity, isCurrentJob } from "../functions";

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
          case "added":
            {
              const data = document.data();

              if (!isCurrentJob(data)) {
                // if job has a future schedule, skip entry
                return
              }
              data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
              return dispatch(JobsStoreActions.add(document.id, data));
            }
          case "modified":
            {
              const data = document.data();
              if (!isCurrentJob(data)) {
                // if not current job, skip entry
                return
              }
              data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
              return dispatch(JobsStoreActions.update(document.id, data));
            }
          case "removed":
            {
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
    .where("status", "in", ["available", "in review", "accepted", "in progress"]);

  const unsubscribe = query.onSnapshot((res) => {
    res.docChanges().forEach((change) => {
      const { doc: document } = change;
      switch (change.type) {
        case "added":
          {
            return dispatch(ListingsActions.add(document.id, document.data()));
          }
        case "modified":
          {
            return dispatch(ListingsActions.update(document.id, document.data()));
          }
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

exports.changeJobStatus = async (documentID, status, userID = "") => {
  const geoCollection = GeoFirestore.collection("jobs").doc(documentID);

  // Update job status
  await geoCollection.update({ status, executed_by: userID });
};

exports.validateQrCode = (project_manager_id, contractor_id, qr_code) => {
  db.collection("jobs")
    .doc(qr_code)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        if (data.executed_by == contractor_id) {
          module.changeJobStatus(doc.id, "in progress", contractor_id);
        }
      }
    });
};

exports.currentUserJobsHistory = (user) => { };

exports.postUserJob = async (userID, job, token, photos = []) => {
  if (!userID) throw new Error("User ID is required");
  if (!job) throw new Error("A job is required");

  const newJob = {
    posted_by: userID,
    posted_by_profile_picture: `/images/${userID}.jpg`,
    date_created: new Date(),
    date_completed: null,
    star_rate: null,
    status: "available",
    ...job,
  };

  const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference
  const { coordinates } = newJob;
  const GeoPoint = new firebase.firestore.GeoPoint(...coordinates);

  let newJobDoc
  let filenames
  try {
    newJobDoc = geoCollection.doc()
    if (photos) {
      const body = new FormData()
      photos.map(photo => {
        const uriSplit = photo.uri.split("/")
        body.append('photo', {
          uri: photo.uri,
          type: photo.type,
          name: uriSplit[uriSplit.length - 1]
        })
      })

      const apiResponse = await fetch(`${config.API_URL}/job/upload`, {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          'x-job-id': newJobDoc.id,
          'Content-Type': 'multipart/form-data'
        },
        body
      })
      if (!apiResponse.ok) {
        throw new Error((await apiResponse.json()).message || 'Failed to upload job')
      }

      filenames = (await apiResponse.json()).data
    }

    return newJobDoc.set({ ...newJob, coordinates: GeoPoint, photo_files: filenames })
      .then(() => {
        return new Promise((resolution, rejection) => {
          resolution({ success: true });
        });
      })
      .catch((error) => {
        return new Promise((resolution, rejection) => {
          rejection({ success: false, error: error.message });
        });
      });
  } catch (e) {
    console.log(e)
    if (newJobDoc) {
      newJobDoc.delete()
    }
    throw e
  }
  // Test
};

exports.updateUserJob = (userID, jobID, updatedJob) => {
  if (!userID) throw new Error("User ID is required");
};
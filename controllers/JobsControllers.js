// Dependencies
import * as firebase from "firebase";
import { GeoFirestore } from "../config/firebase";
// Config
import config from "../env";
// Functions
import { distanceBetweenTwoCoordinates, isCurrentJob, isCurrentJobCreatedByUser, sortJobsByProximity } from "../functions";
// Redux Actions
import JobsStoreActions from "../rdx-actions/jobs.action";
import ListingsActions from "../rdx-actions/listings.action";

const Actions = { JobsStoreActions, ListingsActions };

exports.getJobsAndSubscribeJobsChannel = (state, dispatch) => {
  // State
  const { location, setLocation } = state;
  const { setError } = state;
  const { authState } = state; // Client/User information
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

            if (!isCurrentJob(data) || isCurrentJobCreatedByUser(data, authState.userID)) {
              // if job has a future schedule, skip entry
              return;
            }
            data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
            return dispatch(JobsStoreActions.add(document.id, data));
          }
          case "modified": {
            const data = document.data();
            if (!isCurrentJob(data) || isCurrentJobCreatedByUser(data, authState.userID)) {
              // if not current job, skip entry
              return;
            }
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
    .where("status", "in", ["available", "in review", "accepted", "in progress"]);

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

exports.findFirstJobWithKeyword = (searched_Keywords = "", jobs, userID = "") => {
  if (!searched_Keywords) {
    return;
  }
  const jobsFound = jobs.filter((job) => job?.job_type?.toLowerCase().startsWith(searched_Keywords.trim().toLowerCase()));
  return sortJobsByProximity(jobsFound, (a, b) => a.distance - b.distance)[0];
};

exports.changeJobStatus = async (documentID, status, userID = "") => {
  const geoCollection = GeoFirestore.collection("jobs").doc(documentID);

  // Update job status
  await geoCollection.update({ status, executed_by: userID });
};

// TODO: upon cancellation, either suspend or bill the deployee or deployer
exports.cancelAcceptedJob = async (documentID, authState) => {
  const {
    userData: { role },
  } = authState;
  const geoCollection = GeoFirestore.collection("jobs").doc(documentID);

  if (role === "contractor") {
    // Handle logic when a deployee cancels a job.
    // The deployee should receive a penalty.
  } else {
    // Penalty for cancellation as a deployer
  }

  // Update job status
  await geoCollection.update({
    offer_received: firebase.firestore.FieldValue.delete(),
    status: "available",
  });
};

/**
 * Used to send an offer by a deployee
 * @param {*} documentID
 * @param {*} deployee
 * @param {*} offer
 */
exports.sendOffer = async (documentID, deployee, offer, wage = "hr") => {
  if (!deployee) {
    throw new Error("User identity must be provided");
  }
  if (!offer || typeof offer == "number" || offer <= 0) {
    throw new Error("You must provide a valid offer");
  }
  const doc = GeoFirestore.collection("jobs").doc(documentID);
  const offer_received = {
    deployee,
    offer,
    wage,
    approved: false,
  };

  await doc.update({
    offer_received,
  });
  return offer_received;
};

/**
 * Used by deployee or deployer to cancel an offer already sent
 *
 * @param {*} documentID
 */
exports.cancelOffer = async (documentID) => {
  const doc = GeoFirestore.collection("jobs").doc(documentID);
  await doc.update({
    offer_received: firebase.firestore.FieldValue.delete(),
    executed_by: "",
    status: "available",
  });
};

exports.approveOffer = async (documentID, deployee) => {
  if (!deployee) {
    throw new Error("Deployee identity must be provided");
  }
  const doc = GeoFirestore.collection("jobs").doc(documentID);
  await doc.update({
    "offer_received.approved": true,
    status: "accepted",
  });
};

exports.counterOffer = async (documentID, offer, wage) => {
  if (!offer) {
    throw new Error("Offer must be provided");
  }
  const doc = GeoFirestore.collection("jobs").doc(documentID);
  await doc.update({
    "offer_received.counterOffer": offer,
    "offer_received.counterWage": wage,
  });
};

exports.counterApprove = async (documentID, offer) => {
  if (!offer) {
    throw new Error("Offer must be provided");
  }
  const doc = GeoFirestore.collection("jobs").doc(documentID);
  await doc.update({
    "offer_received.counterOffer": firebase.firestore.FieldValue.delete(),
    "offer_received.offer": offer,
    "offer_received.approved": true,
    status: "accepted",
  });
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

exports.currentUserJobsHistory = (user) => {};

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

  let newJobDoc;
  let filenames = null;
  try {
    newJobDoc = geoCollection.doc();
    if (photos && photos.length > 0) {
      const body = new FormData();
      photos.map((photo) => {
        const uriSplit = photo.uri.split("/");
        body.append("photo", {
          uri: photo.uri,
          type: photo.type,
          name: uriSplit[uriSplit.length - 1],
        });
      });

      const apiResponse = await fetch(`${config.API_URL}/job/upload`, {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "x-job-id": newJobDoc.id,
        },
        body,
      });
      if (!apiResponse.ok) {
        throw new Error((await apiResponse.json()).message || "Failed to upload job");
      }

      filenames = (await apiResponse.json()).data;
    }

    return newJobDoc
      .set({ ...newJob, coordinates: GeoPoint, photo_files: filenames })
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
    console.log(e);
    if (newJobDoc) {
      newJobDoc.delete();
    }
    throw e;
  }
  // Test
};

exports.updateUserJob = (userID, jobID, updatedJob) => {
  if (!userID) throw new Error("User ID is required");
};

exports.getUserJobComments = (userID, state) => {
  // Screen State
  const { setComments } = state;

  const query = GeoFirestore.collection("comments").doc(userID).collection("messages");

  let comments = [];

  query.get().then((querySnapshot) => {
    const array = querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      comments.push(doc.data());
    });
  });

  setComments(comments);
};

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
          data.distance = distanceBetweenTwoCoordinates(data.coordinates.latitude, data.coordinates.longitude, latitude, longitude);
          return dispatch(JobsStoreActions.add(document.id, data));
        }
        case "modified": {
          const data = document.data();
          if (!isCurrentJob(data) || isCurrentJobCreatedByUser(data, authState.userID)) {
            // if not current job, skip entry
            return;
          }
          data.distance = distanceBetweenTwoCoordinates(data.coordinates.latitude, data.coordinates.longitude, latitude, longitude);
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
};

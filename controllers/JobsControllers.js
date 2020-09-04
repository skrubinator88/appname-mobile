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
import { distanceBetweenTwoCoordinates } from "../functions/";

// Redux Actions
import JobsStoreActions from "../rdx-actions/jobs.action";

exports.addJob = (job) => {
  // *** Get jobs ***
  const firestore = firebase.firestore(); // Create a Firestore reference
  const GeoFirestore = geofirestore.initializeApp(firestore); // Create a GeoFirestore reference
  const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference
  const { coordinates } = job;
  const GeoPoint = new firebase.firestore.GeoPoint(...coordinates);
  // geoCollection.add({ ...job, coordinates: GeoPoint });
  // geoCollection.add({
  //   posted_by: "5f32daf2c4a77e001713b6d5",
  //   job_type: "Software Developer",
  //   title: "Create a Web App",
  //   tasks: ["Build the sms Server", "Build payment system", "Bring the ketchup"],
  //   pay_rate: 30.0,
  //   payment_frequency: "hr",
  //   date_completed: "Fri Jul 30 2020 12:06:16 GMT-0400 (Eastern Daylight Time)",
  //   star_rate: 4.1,
  //   status: "available",
  //   "date _created": "Fri Jul 30 2020 12:06:16 GMT-0400 (Eastern Daylight Time)",
  //   location_address: "6684 Peachtree Industrial Blvd. Atlanta GA 30360",
  //   status: "active",
  //   coordinates: new firebase.firestore.GeoPoint(33.8760658, -84.3147504),
  // });
};

exports.getJobsAndSubscribeJobsChannel = (state, dispatch) => {
  // State
  const { location, setLocation } = state;
  const { setError } = state;
  let { radius } = state;
  const { latitude, longitude } = location.coords;

  radius = 1000; // replace

  if (location != null) {
    const geoCollection = GeoFirestore.collection("jobs"); // Create a GeoCollection reference

    // Queries
    const query = geoCollection
      .near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: radius })
      .where("status", "==", "available");

    // ** Subscribe, add jobs into store and listen for changes **
    // This function returns an unsubscribe function to close this listener
    console.log("SUBSCRIBED || Firebase ||");
    const unsubscribe = query.onSnapshot((res) => {
      res.docChanges().forEach((change) => {
        const { doc: document } = change;
        switch (change.type) {
          case "added":
            return dispatch(JobsStoreActions.add(document.id, document.data()));
          case "modified":
            return dispatch(JobsStoreActions.update(document.id, document.data()));
          case "removed":
            // dispatch(QueueStoreActions.remove(document.id))
            return dispatch(JobsStoreActions.remove(document.id));
          default:
            break;
        }
      });
    });

    return unsubscribe;
  }
};

exports.getJobTagType = (imageType) => {
  switch (imageType) {
    case "user":
      return require("../assets/user-icon2.png");
      break;
  }
};

exports.clean = (unsubscribe, dispatch) => {
  if (unsubscribe) {
    unsubscribe(); // Unsubscribe from firebase
    console.log("UNSUBSCRIBED || Firebase ||");
  }

  dispatch(JobsStoreActions.clear()); // Clear jobs from state
};

exports.findJobWithKeyword = (searched_Keywords, jobs) => {
  // console.log(jobs[0]?.job_type);
  return jobs.filter((job) => job?.job_type === searched_Keywords);
};

exports.changeJobStatus = async (documentID, status) => {
  const geoCollection = GeoFirestore.collection("jobs").doc(documentID);

  // Update job status
  geoCollection.update({ status });
};

// Project Manager Functions
exports.currentUserActiveJobs = (user) => {};

exports.currentUserJobsHistory = (user) => {};

exports.postUserJob = (user, job) => {};

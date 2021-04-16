import firebase from "firebase/app";
import "firebase/firestore";
import * as geofirestore from "geofirestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjXx1AqIQnkyKkCPh8HZKZYyiKGfiLcbc",
  authDomain: "contracting-app.firebaseapp.com",
  databaseURL: "https://contracting-app.firebaseio.com",
  projectId: "contracting-app",
  storageBucket: "contracting-app.appspot.com",
  messagingSenderId: "557426956160",
  appId: "1:557426956160:web:c1393a9710ed0e40151365",
};

!firebase.apps.length && firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore(); // Create a Firestore reference
export const GeoFirestore = geofirestore.initializeApp(firestore); // Create a GeoFirestore reference

import React from "react";
import axios from "axios";

import env from "../env.js";

// Functions
import { createToken } from "../functions";

// Controllers
import PermissionsController from "../controllers/PermissionsControllers";

let sessionToken = null;
let location = null;

exports.createSession = async () => {
  sessionToken = createToken();
  location = await PermissionsController.getLocation();
};

exports.getPlacesSuggestions = async (input) => {
  try {
    const { data } = await axios.get(`${env.GOOGLE.PLACES_URI}/autocomplete/json`, {
      params: {
        key: env.GOOGLE.GEOLOCATION_KEY,
        language: "en",
        types: "address",
        location, // For great user experience
        radius: 1000, // For great user experience
        input,
        sessiontoken: sessionToken,
      },
    });

    return Array.from(data["predictions"].map((item) => ({ address: item.description, place_id: item.place_id, id: item.place_id })));
  } catch (e) {
    console.log(e);
  }
};

exports.getCoordinatesFromPlaceID = async (placeid) => {
  const { data } = await axios.get(`${env.GOOGLE.PLACES_URI}/details/json`, {
    params: {
      key: env.GOOGLE.GEOLOCATION_KEY,
      language: "en",
      placeid,
      sessiontoken: sessionToken,
    },
  });
  const { result } = data;
  return result;
};

exports.clean = () => {
  sessionToken = "";
  location = null;
};

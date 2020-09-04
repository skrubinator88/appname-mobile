// Dependencies
import axios from "axios";
import * as Permissions from "expo-permissions";

// Config
import config from "../env";
import * as Location from "expo-location";

exports.getLocation = async () => {
  let position = null;
  try {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") setErrorMsg("Permission to access location was denied");
    position = await Location.getLastKnownPositionAsync();
  } catch (e) {
    position = await Location.getCurrentPositionAsync();
  }
  return position;
};

// Dependencies
import axios from "axios";
import * as Permissions from "expo-permissions";

// Config
import config from "../env";
import * as Location from "expo-location";

// Memory

exports.getLocation = async () => {
  const { granted } = await Permissions.getAsync(Permissions.LOCATION);

  if (!granted) {
    let position;
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") setErrorMsg("Permission to access location was denied");
      position = await Location.getLastKnownPositionAsync();
    } catch (e) {
      position = await Location.getCurrentPositionAsync();
    }
    return position;
  }
};

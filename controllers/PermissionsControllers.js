// config
import config from "../env";

// Dependencies
import axios from "axios";
import { Platform } from "react-native";

// Expo
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Constants from "expo-constants";

exports.askPermissions = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS, Permissions.LOCATION);
  if (status !== "granted") {
    return true;
  } else if (status !== "denied") {
    throw new Error("denied");
  }
};

exports.getLocation = async () => {
  let position = null;
  try {
    // let { status } = await Permissions.getAsync(Permissions.LOCATION);
    let { status } = await Location.requestPermissionsAsync();
    // let finalStatus = existingStatus;
    if (status !== "granted") setErrorMsg("Permission to access location was denied");
    // const { status } = await Permissions.askAsync(Permissions.LOCATION);
    // finalStatus = status;
    // if (finalStatus !== "granted") {
    //   alert("Failed to get location!");
    //   return;
    // }
    position = await Location.getLastKnownPositionAsync();
  } catch (e) {
    position = await Location.getCurrentPositionAsync();
  }
  return position;
};

exports.registerForPushNotificationsAsync = async (setToken) => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    setToken({ expoPushToken: token });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

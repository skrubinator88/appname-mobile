// config
import config from "../env";

// Dependencies
import axios from "axios";
import { Platform } from "react-native";

// Expo
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-community/async-storage";
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
    position = await Location.getCurrentPositionAsync(Platform.OS === 'android' ? { enableHighAccuracy: true } : null);
  }
  return position;
};

exports.registerForPushNotificationsAsync = async (userToken, setToken) => {
  if (!userToken) {
    // User token must be specified to use push notifications
    console.log('no token provided', 'register push')
    return
  }
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    if (token) {
      try {
        const response = await fetch(`${config.API_URL}/notification/setup`, {
          method: "POST",
          headers: {
            Authorization: `bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        })
        if (!response.ok) {
          throw new Error((await response.json()).message || 'Failed to register device')
        }

        await AsyncStorage.setItem(`app.token`, token);
      } catch (e) {
        console.error(e, 'registration error')
      }
    }
    if (setToken) {
      setToken({ expoPushToken: token });
    }
  } else {
    console.info("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("GigChasers-Notification", {
      name: "GigChasers-Notification",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

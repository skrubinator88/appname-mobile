import React, { useEffect, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";

import styled from "styled-components/native";

// Interfaces
import { CameraInterface } from "../../../interfaces/mapview-interfaces";
import { mapStyle } from "../../../components/mapStyle";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export function RootScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchBarValue, setSearchBarValue] = useState("");
  let initialCameraSettings;
  let cameraSettings;

  // Get initial location
  useEffect(() => {
    (async () => {
      let position;
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }
      try {
        position = await Location.getLastKnownPositionAsync();
      } catch (e) {
        position = await Location.getCurrentPositionAsync();
      }
      setLocation(position);
      return;
    })();
  }, []);

  if (location != null) {
    const zoom = 12; // Change the zoom between 2 and 20
    const base = -100; // Change this number to set the position of the GPS Icon (Vertically only) between -200 and 200 Default: -100
    initialCameraSettings = new CameraInterface({
      latitude: location.coords.latitude + base / Math.pow(2, zoom - 1),
      longitude: location.coords.longitude,
      altitude: 0,
      pitch: 0,
      heading: 0,
      zoom,
    });
    // cameraSettings = new CameraInterface({
    //   latitude: location.coords.latitude + (base / Math.pow(2, zoom - 1)),
    //   longitude: location.coords.longitude,
    //   altitude: 0,
    //   pitch: 0,
    //   heading: 0,
    //   zoom,
    // });
  }
  // Fetch each Job Posting in ratio from API
  // 1. Send device location with a Get Method
  // 2. Push data to state
  const [jobPostings, setJobPostings] = useState([
    {
      title: "Username",
      description: "Clean toilet",
      image: "imageSource",
      coordinate: { latitude: 33.92, longitude: -84.32 },
      id: 123123,
    },
    {
      id: 123444,
      title: "Username",
      description: "Fix TV",
      image: "imageSource",
      coordinate: { latitude: 33.9, longitude: -84.34 },
    },
    {
      id: 123552,
      title: "Username",
      description: "Wall Work",
      image: "imageSource",
      coordinate: { latitude: 33.91, longitude: -84.3 },
    },
  ]);

  if (location != null) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <Container>
          <MapView
            // Common
            provider="google"
            // maxZoomLevel={18} // 18
            // minZoomLevel={9} // 9
            initialCamera={initialCameraSettings}
            // camera={initialCameraSettings}
            // iOS
            showsUserLocation={true}
            // Android

            // Other props
            style={{ flex: 1 }}
          >
            {/* Render each marker */}
            {jobPostings.map(({ title, description, coordinate, id }) => (
              <Marker
                key={id}
                title={title}
                description={description}
                coordinate={coordinate}
              ></Marker>
            ))}
          </MapView>

          {/* UI */}

          <Menu
            activeOpacity={0.9}
            onPress={() => {
              Keyboard.dismiss();
              navigation.openDrawer();
            }}
          >
            <MaterialIcons
              backgroundColor="white"
              color="black"
              name="menu"
              size={30}
            />
          </Menu>

          <SearchBar
            placeholder="Search jobs"
            placeholderTextColor="#777"
          ></SearchBar>

          <KeyboardAvoidingView behavior={{ behavior: "position" }}>
            <Card>
              <Row last>
                <SafeAreaView>
                  <Text medium>0.0.0.1</Text>
                </SafeAreaView>
              </Row>
            </Card>
          </KeyboardAvoidingView>
        </Container>
      </TouchableWithoutFeedback>
    );
  } else {
    return <View></View>;
  }
}

// STYLES
const Container = styled.View`
  flex: 1;
`;

const Menu = styled.TouchableOpacity`
  position: absolute;
  left: 6%;
  top: 6%;
  border-radius: 50px;
  background: white;
  padding: 10px;
`;

const SearchBar = styled.TextInput`
  position: absolute;
  top: 15%;
  left: 15%;
  width: 70%;
  font-size: 17px;
  color: red;
  border: 2px solid #ededed;
  border-radius: 50px;
  background: white;
  padding: 7px 15px;
`;

const Card = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 40px;
  background: white;
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: ${({ first, last }) => {
    switch (true) {
      case first:
        return "space-between";
      case last:
        return "space-around";
      default:
        return "flex-start";
    }
  }};
  /* justify-content:  */
  margin: ${(props) => {
    if (props.first) {
      return "30px 10px 0 10px";
    } else if (props.last) {
      // return `20px 10px 50px 10px`;
      return "30px 10px 0 10px";
    } else {
      return "0px 0px";
    }
  }};
  padding: 0 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Text = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    switch (true) {
      case title:
        return `font-size: 22px`;

      case medium:
        return `font-size: 20px`;

      case small:
        return `font-size: 39px`;
    }
  }}

  ${({ bold, light }) => {
    switch (true) {
      case bold:
        return `font-weight: 800`;

      case light:
        return `font-weight: 300; color: #999;`;
    }
  }}
`;

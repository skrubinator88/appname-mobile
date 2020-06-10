// IMPORT
import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import styled from "styled-components/native";
// import Icon from "react-native-vector-icons/FontAwesome";
import { ResponsiveSize } from "./components/font-responsiveness";
// import { ResponsiveSize } from "./components/device-responsiveness";

// Interfaces
import { CameraInterface } from "./interfaces/mapview-interfaces";

// Expo
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// BODY
export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
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
      position = await Location.getLastKnownPositionAsync();
      setLocation(position);

      return;
    })();
  }, []);

  // Map Settings
  if (location != null) {
    // Chart for displaying the gps location
    // icon at the third of the screen.
    // ========================
    // = Zoom = Sub. Latitude =
    // ========================
    // = 18   =  -0.0009375   =
    // = 17   =  -0.001875    =
    // = 16   =  -0.00375     =
    // = 15   =  -0.0075      =
    // = 14   =  -0.015       =
    // = 13   =  -0.03        =
    // = 12   =  -0.06        =
    // = 11   =  -0.12        =
    // = 10   =  -0.24        =
    // = 09   =  -0.48        =
    // ========================
    const zoom = 11;
    const subLatitud = -0.12;
    initialCameraSettings = new CameraInterface({
      latitude: location.coords.latitude + subLatitud,
      longitude: location.coords.longitude,
      altitude: 0,
      pitch: 0,
      heading: 0,
      zoom,
    });
    // cameraSettings = new CameraInterface({
    //   latitude: location.coords.latitude - 0.0009375,
    //   longitude: location.coords.longitude,
    //   altitude: 0,
    //   pitch: 0,
    //   heading: 0,
    //   zoom: 18,
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
      <Container>
        <MapView
          // Common
          provider="google"
          maxZoomLevel={18} // 18
          minZoomLevel={9} // 9
          initialCamera={initialCameraSettings}
          // camera={cameraSettings}
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

        <Card>
          <ProfilePicture
            source={{
              uri: "https://i.insider.com/5899ffcf6e09a897008b5c04?width=1200",
            }}
          ></ProfilePicture>

          <Row first>
            <Column>
              <Text title bold>
                John Doe
              </Text>
              <Text small light>
                Domestic Worker
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text bold>
                  <FontAwesome name="map-marker" size={24} color="black" />
                </Text>
                <Text style={{ marginLeft: 10 }} bold>
                  13 min
                </Text>
              </View>
            </Column>
            <Column>
              {/* Iterate from array of data pulled from server and render as stars */}
              <View style={{ flexDirection: "row" }}>
                <Text style={{ paddingHorizontal: 1 }}>
                  <FontAwesome name="star" size={24} color="black" />
                </Text>
                <Text style={{ paddingHorizontal: 1 }}>
                  <FontAwesome name="star" size={24} color="black" />
                </Text>
                <Text style={{ paddingHorizontal: 1 }}>
                  <FontAwesome name="star" size={24} color="black" />
                </Text>
                <Text style={{ paddingHorizontal: 1 }}>
                  <FontAwesome name="star" size={24} color="black" />
                </Text>
                <Text style={{ paddingHorizontal: 1 }}>
                  <FontAwesome name="star-o" size={24} color="black" />
                </Text>
              </View>
              <Text style={{ textAlign: "center" }} bold>
                4.01
              </Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button>
                <Text medium>View Skills & Licenses</Text>
              </Button>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text medium>View Profile</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Button row>
                <Text medium>Reviews</Text>
              </Button>
            </Column>
          </Row>
          <Row last>
            <Column>
              <Button decline>
                <Text style={{ color: "red" }} medium>
                  Decline
                </Text>
              </Button>
            </Column>
            <Column>
              <Button accept>
                <Text style={{ color: "white" }} medium>
                  Accept
                </Text>
              </Button>
            </Column>
          </Row>
        </Card>
      </Container>
    );
  } else {
    return <View></View>;
  }
}

// STYLES
const Container = styled.View`
  flex: 1;
`;

const Card = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 40px;
  background: white;
  width: 100%;
`;

const ProfilePicture = styled.Image`
  margin: -50px auto;
  height: 100px;
  width: 100px;
  border-radius: 50px;
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
      return `20px 10px 50px 10px`;
    } else {
      return "0px 0px";
    }
  }};
  padding: 0 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  margin: 5px 0;
`;

const Text = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    switch (true) {
      case title:
        return `font-size: ${ResponsiveSize(19)}px`;

      case medium:
        return `font-size: ${ResponsiveSize(15)}px`;

      case small:
        return `font-size: ${ResponsiveSize(13)}px`;
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

const Button = styled.TouchableOpacity`
  ${({ decline, accept, row }) => {
    switch (true) {
      case accept:
        return `
        background: #00a0e5; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;

      case decline:
        return `
        border: 1px solid red; 
        background: white; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;
    }
  }}
`;

// IMPORT
import React, { useState } from "react";
import { View, Platform } from "react-native";
import styled from "styled-components/native";
// import Icon from "react-native-vector-icons/FontAwesome";
import { ResponsiveSize } from "./components/font-responsiveness";
// import { ResponsiveSize } from "./components/device-responsiveness";

// Interfaces
import { CameraInterface } from "./interfaces/mapview-interfaces";

// Expo
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// BODY
export default function App() {
  const [location, setLocation] = useState(null);

  (async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    let location = await Location.getLastKnownPositionAsync();
    setInterval(() => {
      // setLocation(location);
    }, 10000);
  })();

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

  // Map Settings
  const cameraSettings = CameraInterface({
    latitude: 33.926,
    longitude: -85.49,
    altitude: 10,
    pitch: 10,
    heading: 10,
    zoom: 2,
  });
  npm;
  const regionSettings = {
    latitude: 33.9204673,
    longitude: -84.2805469,
    latitudeDelta: 1,
    longitudeDelta: 1,
  };

  return (
    <Container>
      <MapView
        provider="google"
        showsUserLocation={true}
        maxZoomLevel={18}
        minZoomLevel={11} // 11
        region={regionSettings}
        camera={cameraSettings}
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

      <Section>
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
            <Text bold>*Icon* 13 min</Text>
          </Column>
          <Column>
            <Text>5 Stars</Text>
            <Text>4.01</Text>
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
      </Section>
    </Container>
  );
}

// STYLES
const Container = styled.View`
  flex: 1;
  background: red;
`;

const Section = styled.View`
  /* position: absolute; */
  margin-top: -40px;
  left: 0;
  bottom: 0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
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
  justify-content: space-between;
  margin: ${(props) => {
    if (props.first) {
      return "10px 10px 0 10px";
    } else if (props.last) {
      return `20px 10px 20px 10px`;
    } else {
      return "0px 10px";
    }
  }};
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  margin: 2% 0;
  padding: 0 18px;
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
  /* background-color: red; */

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

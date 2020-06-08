// IMPORT
import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
// import Icon from "react-native-vector-icons/FontAwesome";

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
    // console.log(location);
    // setInterval(() => {
    //   setLocation(location);
    // }, 1000);
  })();

  // Send location to API

  // Fetch each Job Posting in ratio from API
  const [jobPostings, setJobPostings] = useState([
    {
      title: "Username",
      description: "Clean toilet",
      image: "imageSource",
      coordinate: { latitude: 33.92, longitude: -84.28 },
      id: 123123,
    },
    {
      id: 123444,
      title: "Username",
      description: "Fix TV",
      image: "imageSource",
      coordinate: { latitude: 33.9, longitude: -84.39 },
    },
    {
      id: 123552,
      title: "Username",
      description: "Wall Work",
      image: "imageSource",
      coordinate: { latitude: 33.926, longitude: -84.499 },
    },
  ]);

  return (
    // Map
    <MapView
      provider="google"
      showsUserLocation={true} // iOS Working
      followsUserLocation={true}
      maxZoomLevel={18}
      minZoomLevel={15} // 13
      region={{
        latitude: 33.9204673,
        longitude: -84.2805469,
        latitudeDelta: 0,
        longitudeDelta: 1,
      }}
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

      {/* UI */}

      <Container>
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
            <Text medium>View Skills & Licenses</Text>
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
      </Container>
    </MapView>
  );
}

// STYLES
const Container = styled.View`
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
  justify-content: space-between;
  margin: ${(props) => {
    if (props.last) {
      return "0px 10px 30px 10px";
    } else if (props.first) {
      return "10px 10px 0 10px";
    } else {
      return "0px 10px";
    }
  }};
  border-bottom-color: #cecece;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  margin: 10px 0;
  padding: 0 25px;
`;

const Text = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    switch (true) {
      case title:
        return `font-size: 24px`;

      case medium:
        return `font-size: 21px`;

      case small:
        return `font-size: 19px`;
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
        return "background: #00a0e5; padding: 10px 40px; border-radius: 8px;";

      case decline:
        return "background: white; padding: 10px 40px; border-radius: 8px;";
    }
  }}
`;

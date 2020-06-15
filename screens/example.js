// IMPORT
import React, { useState, useEffect } from "react";
import { View, Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
// import { ResponsiveSize } from "../components/font-responsiveness";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

// Interfaces
import { CameraInterface } from "../interfaces/mapview-interfaces";

// Expo
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// BODY
export function Example({ navigation }) {
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
      try {
        position = await Location.getLastKnownPositionAsync();
      } catch (e) {
        position = await Location.getCurrentPositionAsync();
      }
      setLocation(position);

      return;
    })();
  }, []);

  // Map Settings
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
  // = 08   =  -0.96        =
  // = 07   =  -1.92        =
  // = 06   =  -3.84        =
  // = 05   =  -7.68        =
  // = 04   =  -15.36       =
  // = 03   =  -30.72       =
  // = 02   =  -61.44       =
  // ========================
  if (location != null) {
    const zoom = 10; // Change the zoom number between 2 and 20
    const base = -100; // Change this number to set the position of the GPS Icon in the screen (Vertically only) between 200 and -200
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
      <Container>
        <MapView
          // Common
          provider="google"
          // maxZoomLevel={18} // 18
          // minZoomLevel={9} // 9
          // initialCamera={initialCameraSettings}
          camera={initialCameraSettings}
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
              <Button decline onPress={() => navigation.pop()}>
                <Text style={{ color: "red" }} medium>
                  Decline
                </Text>
              </Button>
            </Column>
            <Column>
              <Button accept onPress={() => navigation.push("Home2")}>
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
  /* border-radius: 40px; */
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
    // iPhone 5, 6 SE
    // Small Android phones
    if (deviceHeight < 668) {
      if (props.first) {
        return "30px 5px 0 5px";
      } else if (props.last) {
        return "20px 10px 30px 10px";
      } else {
        return "0px 0px";
      }
    }

    if (props.first) {
      return "30px 10px 0 10px";
    } else if (props.last) {
      return `${
        Platform.OS == "ios" ? "20px 10px 50px 10px" : "20px 10px 30px 10px"
      }`;
    } else {
      return "0px 0px";
    }
  }};
  padding: 0 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  margin: ${() => {
    // iPhone 5, 6 SE
    // Small Android phones
    if (deviceHeight < 668) {
      return "4px 0";
    }

    return Platform.OS == "ios" ? "5px 0" : "1px";
  }};
`;

const Text = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    // iPhone 5, 6 SE
    // Small Android phones
    if (deviceHeight < 668) {
      switch (true) {
        case title:
          return `font-size: ${Platform.OS == "ios" ? 20 : 15}px`;

        case medium:
          return `font-size: ${Platform.OS == "ios" ? 16 : 12}px`;

        case small:
          return `font-size: ${Platform.OS == "ios" ? 14 : 14}px`;
      }
    }

    switch (true) {
      case title:
        return `font-size: ${Platform.OS == "ios" ? 30 : 25}px`;

      case medium:
        return `font-size: ${Platform.OS == "ios" ? 22 : 17}px`;

      case small:
        return `font-size: ${Platform.OS == "ios" ? 17 : 14}px`;
    }
  }}

  ${({ bold, light }) => {
    switch (true) {
      case bold:
        return `font-weight: ${Platform.OS == "ios" ? 700 : "bold"}`;

      case light:
        return `font-weight: ${Platform.OS == "ios" ? 300 : 100}; color: #999;`;
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

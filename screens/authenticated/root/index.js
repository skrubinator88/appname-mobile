import React, { useEffect, useState } from "react";
import { View } from "react-native";

export function RootScreen({ navigation }) {
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
        <Menu>
          <MaterialIcons
            backgroundColor="white"
            color="black"
            name="menu"
            size={30}
            onPress={() => navigation.openDrawer()}
          />
        </Menu>

        <Card>
          <Row last>
            <Text medium>0.0.0.1</Text>
          </Row>
        </Card>
      </Container>
    );
  } else {
    return <View></View>;
  }
}

import React, { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, Dimensions, Image, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";

import styled from "styled-components/native";
import Header from "../../../components/header";

import env from "../../../env";

const width = Dimensions.get("screen").width;

import { RegistrationContext } from "../../../components/context";

export default function CameraScreen({ navigation }) {
  const { registrationState, methods } = useContext(RegistrationContext);
  const { updateForm, sendForm } = methods;

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  let camera;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const triggerPhoto = async () => {
    const photo = await camera.takePictureAsync({ quality: 0 });
    setCapturedPhoto(photo.uri);
    setShowModal(true);
  };

  const handleSavePhoto = async () => {
    navigation.navigate("SignUp8", { capturedPhoto });

    // setUploading(true);

    // // Send picture to server
    // // console.log(capturedPhoto);

    // // Get URL of image
    // let uploadData = new FormData();
    // uploadData.append("submit", "ok");
    // uploadData.append("avatar", { type: "image/jpeg", uri: capturedPhoto, name: "avatar.jpg" });

    // const res = await fetch(`${env.API_URL}/images/upload`, { method: "POST", body: uploadData });
    // res.json().then((data) => {
    //   console.log(data);
    //   setUploading(false);

    //   updateForm({ profile_picture: data.path });
    //   navigation.goBack();
    // });
  };

  const handleRetakePhoto = () => {
    // abort fetch

    setShowModal(false);
    setCapturedPhoto(null);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 4 }} type={type} ref={(ref) => (camera = ref)} onCameraReady={(e) => setCameraReady(true)}>
        <Header navigation={navigation} background="transparent" color="black" />
        <CameraUI>
          <Circle></Circle>
        </CameraUI>
      </Camera>
      <GUI>
        <Text style={{ textAlign: "center", flex: 1 }}>
          Align your face within the middle of the circle. Remove any sunglasses or hats.
        </Text>
        <View style={{ flex: 2 }}>
          <PhotoTriggerOuter onPress={() => cameraReady && triggerPhoto()}>
            <PhotoTriggerInner></PhotoTriggerInner>
          </PhotoTriggerOuter>
        </View>
      </GUI>

      {capturedPhoto && (
        <Preview animated={true} visible={showModal} transparent={false} style={{ flex: 1 }}>
          <Image source={{ uri: capturedPhoto }} style={{ width: "100%", height: "100%", flex: 4 }} />

          <ButtonGUISection>
            {/* {!uploading ? (
              <SaveImageButton onPress={() => handleSavePhoto()}>
                <Text style={{ textAlign: "center", color: "white" }}>Save Picture</Text>
              </SaveImageButton>
            ) : (
              <LoadingImageButton>
                <ActivityIndicator />
              </LoadingImageButton>
            )} */}

            <SaveImageButton onPress={() => handleSavePhoto()}>
              <Text style={{ textAlign: "center", color: "white" }}>Save Picture</Text>
            </SaveImageButton>

            <CancelImageButton onPress={() => handleRetakePhoto()}>
              <Text style={{ textAlign: "center" }}>Retake Picture</Text>
            </CancelImageButton>
          </ButtonGUISection>
        </Preview>
      )}
    </View>
  );
}
const ButtonGUISection = styled.View`
  background: transparent;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const CancelImageButton = styled.TouchableOpacity`
  border: 2px solid #3869f3;
  border-radius: 3px;
  width: 40%;
  justify-content: center;
  padding: 20px;
`;

const SaveImageButton = styled.TouchableOpacity`
  border: 2px solid #3869f3;
  background: #3869f3;
  border-radius: 3px;
  width: 40%;
  justify-content: center;
  padding: 20px;
`;

const LoadingImageButton = styled.TouchableOpacity`
  border: 2px solid #3869f3;
  background: #3869f3;
  border-radius: 3px;
  width: 40%;
  justify-content: center;
  padding: 20px;
`;

const Preview = styled.Modal`
  justify-content: center;
  align-items: center;
`;

const PhotoTriggerOuter = styled.TouchableOpacity`
  width: 65px;
  height: 65px;
  padding: 3px;
  border-radius: 100px;
  background: #3869f3;
`;

const PhotoTriggerInner = styled.View`
  flex: 1;
  border: 2px solid white;
  /* padding: 10px; */
  border-radius: 100px;
  background: #3869f3;
`;

const CameraUI = styled.View`
  background: transparent;
  margin: 10% 0 0 0;
  flex-direction: row;
  justify-content: center;
`;

const Circle = styled.View`
  border: 3px solid #3869f3;
  width: 80%;
  height: ${Math.floor(Number(width) * 0.8)}px;
  border-radius: 500px;
`;

const GUI = styled.View`
  flex: 1;
  background: white;
  padding: 20px;

  align-items: center;
`;

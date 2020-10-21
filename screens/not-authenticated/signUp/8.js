import React, { useState, useEffect, useContext } from "react";

import { Image, Button, Alert, TextInput, View, SafeAreaView, ActivityIndicator } from "react-native";

import { Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { RegistrationContext } from "../../../components/context";

import env from "../../../env";

// Components
import Text from "../../../components/text";

export default function ({ navigation, route }) {
  const { registrationState, methods } = useContext(RegistrationContext);
  const { updateForm, sendForm } = methods;

  const [errorMsg, setErrorMsg] = useState("");
  const { colors } = useTheme();
  const [gallerySelectedPhoto, setGallerySelectedPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (route.capturedPhoto) {
      console.log(route.capturedPhoto);
    }
    console.log(route);
    console.log("Hell yeah");
  }, [route.capturedPhoto]);

  const handleCamera = async () => {
    const { granted } = await Camera.requestPermissionsAsync();

    if (granted) {
      return navigation.navigate("Camera");
    } else {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === "granted") return navigation.navigate("Camera");
      if (status === "denied") return setErrorMsg(`You need to grant access through your ${Platform.OS} settings`);
    }
  };

  const handleSavePhoto = async () => {
    setUploading(true);

    // Send picture to server
    // console.log(capturedPhoto);

    // Get URL of image
    let uploadData = new FormData();
    uploadData.append("submit", "ok");
    uploadData.append("avatar", { type: "image/jpeg", uri: gallerySelectedPhoto, name: "avatar.jpg" });

    const res = await fetch(`${env.API_URL}/images/upload`, { method: "POST", body: uploadData });
    res.json().then((data) => {
      setUploading(false);

      updateForm({ profile_picture: data.path });

      setShowModal(false);
    });
  };

  const handleRetakePhoto = () => {
    setShowModal(false);
    setGallerySelectedPhoto(null);
  };

  const handleGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        aspect: [16, 9],
        quality: 0,
      });
      if (!result.cancelled) {
        setGallerySelectedPhoto(result.uri);
        setShowModal(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <Text style={{ fontSize: 30 }}>Set your profile photo</Text>

      <Text medium>Users will use this photo to identify you. Show your face without wearing a hat or sunglasses in a well lit area.</Text>

      <Text style={{ color: "#ff3d3d" }}>{errorMsg}</Text>

      <Image source={require("../../../assets/submitProfilePhoto.png")} style={{ borderRadius: 1000, width: 240, height: 240 }} />

      <ButtonStyled onPress={(e) => handleGallery(e)} style={{ backgroundColor: "white", borderColor: colors.primary }}>
        <Text>Upload Photo</Text>
      </ButtonStyled>

      <ButtonStyled onPress={(e) => handleCamera(e)} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
        <Text style={{ color: "white" }}>Take Photo</Text>
      </ButtonStyled>

      {gallerySelectedPhoto && (
        <Preview animated={true} visible={showModal} transparent={false} style={{ flex: 1 }}>
          <View style={{ flex: 4 }}>
            <Image source={{ uri: gallerySelectedPhoto }} style={{ width: "100%", height: "100%" }} />
          </View>

          <ButtonGUISection>
            {!uploading ? (
              <SaveImageButton onPress={() => handleSavePhoto()}>
                <Text style={{ textAlign: "center", color: "white" }}>Save Picture</Text>
              </SaveImageButton>
            ) : (
              <SaveImageButton>
                <ActivityIndicator />
              </SaveImageButton>
            )}

            <CancelImageButton onPress={() => handleRetakePhoto()}>
              <Text style={{ textAlign: "center" }}>Cancel</Text>
            </CancelImageButton>
          </ButtonGUISection>
        </Preview>
      )}
    </Container>
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

const Preview = styled.Modal`
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  background: white;
  flex: 1;
  padding: 7%;
  align-items: center;
  justify-content: space-evenly;
`;

const ButtonStyled = styled.TouchableOpacity`
  padding: 15px;
  width: 80%;
  border-radius: 6px;
  border: 1px solid;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

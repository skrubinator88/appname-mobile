import React, { useState, useEffect } from "react";

import { Image, Button, Alert, TextInput, View, SafeAreaView } from "react-native";

import { Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

// Components
import Text from "../../../components/text";

export default function ({ navigation }) {
  const [errorMsg, setErrorMsg] = useState("");
  const { colors } = useTheme();
  const [gallerySelectedPhoto, setGallerySelectedPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleSavePhoto = () => {};

  const handleRetakePhoto = () => {
    setShowModal(false);
    setGallerySelectedPhoto(null);
  };

  const handleGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
      if (!result.cancelled) {
        // Save image in the cloud instead
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
            <SaveImageButton onPress={() => handleSavePhoto()}>
              <Text style={{ textAlign: "center", color: "white" }}>Save Picture</Text>
            </SaveImageButton>

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

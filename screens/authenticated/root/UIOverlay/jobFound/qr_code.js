import React, { useState, useEffect, useContext } from "react";

import { Image, Dimensions } from "react-native";

import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import { SimpleLineIcons } from "@expo/vector-icons";

const width = Dimensions.get("screen").width;

// Components
import Text from "../../../../../components/text";
import env from "../../../../../env";
import { GlobalContext } from "../../../../../components/context";
import QRCode from "../../../../../components/qr-code-generator/";

export default function QRCodeScreen({ navigation, route }) {
  const { authState } = useContext(GlobalContext);

  const [image, setImage] = useState(null);

  const { colors } = useTheme();

  return (
    <Container>
      <Text style={{ fontSize: 30 }}>QR Code</Text>

      <Text medium>Show the QR code to the client to register your presence at the work site</Text>

      {/* <Image source={require("../../../assets/submitProfilePhoto.png")} style={{ borderRadius: 1000, width: 240, height: 240 }} /> */}
      <QRCode value={`${route.params._id}`} />
      {/* <SimpleLineIcons name="check" size={width * 0.5} color={colors.primary} /> */}

      <ButtonStyled onPress={(e) => navigation.goBack()} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
        <Text style={{ color: "white" }}>Continue</Text>
      </ButtonStyled>
    </Container>
  );
}

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

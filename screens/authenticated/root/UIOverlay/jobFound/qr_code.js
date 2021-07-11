import React, { useState, useEffect, useContext } from "react";

import { View, Dimensions } from "react-native";

import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";

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
      <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', position: 'relative' }}>
        <ButtonStyled onPress={(e) => navigation.goBack()}>
          <AntDesign name='close' color='black' size={30} />
        </ButtonStyled>
        <Text style={{ fontSize: 30 }}>QR Code</Text>
      </View>
      <QRCode value={`${route.params._id}`} />
      <Text medium>Show the QR code to the client to register your presence at the work site</Text>
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
  position: absolute;
  left: 0;
`;

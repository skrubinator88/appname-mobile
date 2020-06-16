// IMPORT
import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import styled from "styled-components/native";
// import { ResponsiveSize } from "../../components/font-responsiveness";

// Interfaces
import { CameraInterface } from "../../../interfaces/mapview-interfaces";

// Expo
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// Stack
import { createStackNavigator } from "@react-navigation/stack";
export const HomeStack = createStackNavigator();

import { Drawer } from "./drawer";

// BODY

export function AuthenticatedStackScreen({ navigation }) {
  return (
    <HomeStack.Navigator headerMode="none">
      <HomeStack.Screen name="HomeScreen" component={Drawer} />
    </HomeStack.Navigator>
  );
}

// STYLES
const Container = styled.View`
  flex: 1;
`;

const Menu = styled.TouchableOpacity`
  position: absolute;
  left: 8%;
  top: 6%;
  border-radius: 50px;
  background: white;
  padding: 10px;
`;

const Card = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 40px;
  background: white;
  width: 100%;
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

const Text = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    switch (true) {
      case title:
        return `font-size: 22px`;

      case medium:
        return `font-size: 20px`;

      case small:
        return `font-size: 39px`;
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

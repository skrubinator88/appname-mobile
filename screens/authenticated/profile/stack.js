// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const ProfileStack = createStackNavigator();

// import pages
import ProfileScreen from "./";
import BackgroundCheckScreen from "./backgroundCheck";

export default function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator headerMode="none">
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Background Check" component={BackgroundCheckScreen} />
    </ProfileStack.Navigator>
  );
}

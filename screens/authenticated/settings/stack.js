// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const SettingsStack = createStackNavigator();

// import pages
import SettingsScreen from ".";

export function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Help Center" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

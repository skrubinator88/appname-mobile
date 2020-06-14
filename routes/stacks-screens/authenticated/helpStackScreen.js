// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const HelpStack = createStackNavigator();

// import pages
import { HelpScreen } from "../screens/helpScreen";

export function HelpStackScreen() {
  return (
    <HelpStack.Navigator>
      <HelpStack.Screen name="Help" component={HelpScreen} />
    </HelpStack.Navigator>
  );
}

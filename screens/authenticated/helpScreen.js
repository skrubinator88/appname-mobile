// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const HelpStack = createStackNavigator();

const HelpScreen = ({ navigation }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Help Screen</Text>
    </View>
  );
};

export function HelpStackScreen() {
  return (
    <HelpStack.Navigator>
      <HelpStack.Screen name="Help" component={HelpScreen} />
    </HelpStack.Navigator>
  );
}

// IMPORT
import React, { useState, useEffect } from "react";
// Stack
import { createStackNavigator } from "@react-navigation/stack";
export const HomeStack = createStackNavigator();
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { Drawer } from "./drawer";

// BODY

export function AuthenticatedStackScreen({ navigation }) {
  return (
    <NavigationContainer independent={true}>
      <HomeStack.Navigator headerMode="none">
        <HomeStack.Screen name="Root" component={Drawer} />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

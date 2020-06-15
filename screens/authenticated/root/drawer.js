// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
export const AuthenticatedDrawer = createDrawerNavigator();

// pages
import { HomeStackScreen } from "./homeStackScreen";
import { ProfileStackScreen } from "./profileStackScreen";
import { HelpStackScreen } from "./helpScreen/stack";
// import Example from "./screens/example";

import { DrawerContent } from "../../../components/drawerContent";

export function AuthenticatedDrawerScreen() {
  return (
    <NavigationContainer independent={true}>
      <AuthenticatedDrawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        {/* <AuthenticatedDrawer.Screen name="Example" component={Example} /> */}
        <AuthenticatedDrawer.Screen name="Home" component={HomeStackScreen} />
        <AuthenticatedDrawer.Screen
          name="Profile"
          component={ProfileStackScreen}
        />
        <AuthenticatedDrawer.Screen name="Help" component={HelpStackScreen} />
      </AuthenticatedDrawer.Navigator>
    </NavigationContainer>
  );
}

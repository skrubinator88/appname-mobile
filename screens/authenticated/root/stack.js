// IMPORT
import React, { useState, useEffect } from "react";
// Stack
import { createStackNavigator } from "@react-navigation/stack";
export const HomeStack = createStackNavigator();
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { Drawer } from "./drawer";
import { UserLocationContextProvider } from "../../../contexts/userLocation";
import { JobContextProvider } from "../../../contexts/JobContext";
import { ListingContextProvider } from "../../../contexts/ListingContext";

// BODY

export function AuthenticatedStackScreen() {
  return (
    <NavigationContainer independent={true}>
      <UserLocationContextProvider>
        <JobContextProvider>
          <ListingContextProvider>
            <HomeStack.Navigator headerMode="none">
              <HomeStack.Screen name="Root" component={Drawer} />
            </HomeStack.Navigator>
          </ListingContextProvider>
        </JobContextProvider>
      </UserLocationContextProvider>
    </NavigationContainer>
  );
}

// IMPORT
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
// import pages
import ProfileScreen from "./";
import BackgroundCheckScreen from "./backgroundCheck";
import BackgroundCheckPricingScreen from "./backgroundCheckPricing";
import CommentsScreen from "./comments";

export const ProfileStack = createStackNavigator();


export default function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator headerMode="none">
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Background Check" component={BackgroundCheckScreen} />
      <ProfileStack.Screen name="Background Check Pricing" component={BackgroundCheckPricingScreen} />

      <ProfileStack.Screen name="Comments" component={CommentsScreen} />
    </ProfileStack.Navigator>
  );
}

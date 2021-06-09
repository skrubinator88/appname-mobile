import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import JobListingsScreen from ".";

export const JobListingsStack = createStackNavigator();


export default function PaymentStackScreen() {
  return (
    <JobListingsStack.Navigator headerMode="none">
      <JobListingsStack.Screen name="Root" component={JobListingsScreen} />
    </JobListingsStack.Navigator>
  );
}

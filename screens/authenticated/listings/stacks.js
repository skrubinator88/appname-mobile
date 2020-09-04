// IMPORT
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const JobListingsStack = createStackNavigator();

// import pages
import JobListingsScreen from ".";
import ListingItem from "./listingItem";

export default function PaymentStackScreen() {
  return (
    <JobListingsStack.Navigator headerMode="none">
      <JobListingsStack.Screen name="Root" component={JobListingsScreen} />

      <JobListingsStack.Screen name="Listing Item" component={ListingItem} />
    </JobListingsStack.Navigator>
  );
}

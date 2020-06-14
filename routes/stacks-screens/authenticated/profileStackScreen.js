// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

import { createStackNavigator } from "@react-navigation/stack";
export const ProfileStack = createStackNavigator();

const ProfileScreen = () => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Profile Screen</Text>
    </View>
  );
};

export function ProfileStackScreen({ navigation }) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerLeft: () => (
            <MaterialIcons.Button
              backgroundColor="white"
              color="black"
              name="arrow-back"
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      />
    </ProfileStack.Navigator>
  );
}

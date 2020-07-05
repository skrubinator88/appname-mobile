// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import { View, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";

import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
export const AuthenticatedDrawer = createDrawerNavigator();

// pages
import { RootScreen } from "./index";
import { ProfileStackScreen } from "../profile/";
import { HelpScreen } from "../helpScreen/";

import { AuthContext } from "../../../components/context/";

function DrawerContent(props) {
  const { colors } = useTheme();
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
      <DrawerHeader style={{ backgroundColor: colors.primary }}>
        <Row>
          <Column>
            <ProfilePicture
              source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} // fetch from server
            />
          </Column>
          <Column>
            <Text title>John Doe</Text>
            <Text medium bold>
              <FontAwesome name="star" size={17} color="white" /> 4.01
            </Text>
          </Column>
        </Row>
      </DrawerHeader>
      <DrawerContentScrollView>
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Payment"
          onPress={() => {}}
          icon={() => <Entypo name="wallet" size={24} color="black" />}
        />
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Work History"
          onPress={() => {}}
          icon={() => <MaterialIcons name="history" size={24} color="black" />}
        />
        <Divider />
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Help Center"
          onPress={() => {}}
          icon={() => <MaterialIcons name="help" size={24} color="black" />}
        />
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Settings"
          onPress={() => {}}
          icon={() => <MaterialIcons name="settings" size={24} color="black" />}
        />
      </DrawerContentScrollView>
      <SafeAreaView>
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Sign Out"
          onPress={() => signOut()}
          icon={() => (
            <MaterialIcons name="exit-to-app" size={24} color="black" />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const Divider = styled.View`
  border: solid #ececec;
  border-bottom-width: 0.5px;
  margin: 10px 0;
`;

const DrawerHeader = styled.View`
  height: 150px;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
`;

const Row = styled.View`
  flex-direction: row;
  width: 100%;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const Text = styled.Text`
  width: 100%;
  color: white;
  padding: 0 0 0 10px;
  ${({ title, medium }) => {
    switch (true) {
      case title:
        return "font-size: 20px;";
      case medium:
        return "font-size: 17px;";
    }
  }}

  ${({ bold }) => {
    switch (true) {
      case bold:
        return "font-weight: 900;";
    }
  }}
`;

const ProfilePicture = styled.Image`
  height: 60px;
  width: 60px;
  border-radius: 60px;
`;

export function Drawer() {
  return (
    <NavigationContainer independent={true}>
      <AuthenticatedDrawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <AuthenticatedDrawer.Screen name="Home" component={RootScreen} />
        <AuthenticatedDrawer.Screen
          name="Profile"
          component={ProfileStackScreen}
        />
        {/* <AuthenticatedDrawer.Screen name="Help" component={HelpStackScreen} /> */}
      </AuthenticatedDrawer.Navigator>
    </NavigationContainer>
  );
}

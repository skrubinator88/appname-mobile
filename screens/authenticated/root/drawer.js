// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import { View, SafeAreaView, Alert, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

export const AuthenticatedDrawer = createDrawerNavigator();

import { GlobalContext } from "../../../components/context/";

function DrawerContent({ navigation }) {
  const { colors } = useTheme();
  const { authActions, authState, errorActions } = useContext(GlobalContext);
  const { signOut } = authActions;

  return (
    <View style={{ flex: 1 }}>
      <DrawerHeader style={{ backgroundColor: colors.primary }}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <Row>
            <Column>
              <ProfilePicture source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} />
            </Column>
            <Column>
              <Text title>
                {authState.userData.first_name} {authState.userData.last_name}
              </Text>
              <Text medium bold>
                <FontAwesome name="star" size={17} color="white" /> {authState.userData.star_rate}
              </Text>
            </Column>
          </Row>
        </TouchableWithoutFeedback>
      </DrawerHeader>
      <DrawerContentScrollView>
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Payment"
          onPress={() => navigation.navigate("Payment")}
          icon={() => <Entypo name="wallet" size={24} color="black" />}
        />
        {authState.userData.role == "contractor" ? (
          <DrawerItem
            labelStyle={{ fontSize: 20 }}
            label="Work History"
            onPress={() => navigation.navigate("Work History")}
            icon={() => <MaterialIcons name="history" size={24} color="black" />}
          />
        ) : (
          <>
            <DrawerItem
              labelStyle={{ fontSize: 20 }}
              label="Job Listings"
              onPress={() => navigation.navigate("Job Listings")}
              icon={() => <Entypo name="megaphone" size={24} color="black" />}
            />
            <DrawerItem
              labelStyle={{ fontSize: 20 }}
              label="Job History"
              // onPress={() => navigation.navigate("Work History")}
              icon={() => <MaterialIcons name="history" size={24} color="black" />}
            />
          </>
        )}
        <Divider />
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Help Center"
          onPress={() => Alert.alert("Work in Progress", "Section still in development")}
          icon={() => <MaterialIcons name="help" size={24} color="black" />}
        />
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Settings"
          onPress={() => navigation.navigate("Settings")}
          icon={() => <MaterialIcons name="settings" size={24} color="black" />}
        />
      </DrawerContentScrollView>
      <SafeAreaView>
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Sign Out"
          onPress={() => signOut()}
          icon={() => <MaterialIcons name="exit-to-app" size={24} color="black" />}
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

// Screens
import { RootScreen } from "./index";
import PaymentScreen from "../payment";
import SettingsScreen from "../settings";
import ProfileScreen from "../profile";
import JobListings from "../listings/stacks";

export function Drawer() {
  return (
    <NavigationContainer independent={true}>
      <AuthenticatedDrawer.Navigator drawerType="back" backBehavior="initialRoute" drawerContent={(props) => <DrawerContent {...props} />}>
        {/* <AuthenticatedDrawer.Screen name="Job Listings" component={JobListings} /> */}

        <AuthenticatedDrawer.Screen name="Root" component={RootScreen} />
        <AuthenticatedDrawer.Screen name="Profile" component={ProfileScreen} />
        <AuthenticatedDrawer.Screen name="Payment" component={PaymentScreen} />
        <AuthenticatedDrawer.Screen name="Work History" component={RootScreen} />
        <AuthenticatedDrawer.Screen name="Help Center" component={RootScreen} />
        <AuthenticatedDrawer.Screen name="Settings" component={SettingsScreen} />

        <AuthenticatedDrawer.Screen name="Job Listings" component={JobListings} />
      </AuthenticatedDrawer.Navigator>
    </NavigationContainer>
  );
}

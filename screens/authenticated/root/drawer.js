import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React, { createRef, useContext, useEffect } from "react";
import { ActivityIndicator, Alert, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../assets/gig-logo";
import { GlobalContext } from "../../../components/context";
import { JobDetails } from "../../../components/JobDetails";
import Text from "../../../components/text";
import { JOB_CONTEXT } from "../../../contexts/JobContext";
import { LISTING_CONTEXT } from "../../../contexts/ListingContext";
import env from "../../../env";
import theme from "../../../theme.json";
import Chat from "../chat/";
import ListingItem from "../listings/listingItem";
import JobListings from "../listings/stacks";
import MessagesScreen from "../messages/";
import PaymentScreen from "../payment/stack";
import { ProfilePage } from "../profile/profilePage";
import ProfileScreen from "../profile/stack";
import Scanner from "../scanner/";
import SettingsScreen from "../settings";
import WorkHistory from "../work-history/";
import { RootScreen } from "./index";
import CompleteJob from "./UIOverlay/jobFound/completeJob";
import QRCode from "./UIOverlay/jobFound/qr_code";


export const AuthenticatedDrawer = createDrawerNavigator();

export function Drawer() {
  const { authState } = useContext(GlobalContext)
  const { ready: deployeeReady } = useContext(JOB_CONTEXT)
  const { ready: deployerReady } = useContext(LISTING_CONTEXT)

  let ready = authState.userData.role === 'contractor' ? deployeeReady : deployerReady

  if (!ready) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <AuthenticatedDrawer.Navigator
        drawerType="back"
        // backBehavior="initialRoute"
        edgeWidth={-100}
        initialRouteName="Root"

        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <AuthenticatedDrawer.Screen name="Root" component={RootScreen} />

        <AuthenticatedDrawer.Screen name="Profile" component={ProfileScreen} />
        <AuthenticatedDrawer.Screen name="ProfilePage" component={ProfilePage} />

        <AuthenticatedDrawer.Screen name="Job Listings" component={JobListings} />
        <AuthenticatedDrawer.Screen name="Messages" component={MessagesScreen} />
        <AuthenticatedDrawer.Screen options={{ unmountOnBlur: true }} name="Scanner" component={Scanner} />
        <AuthenticatedDrawer.Screen options={{ unmountOnBlur: true }} name="Work History" component={WorkHistory} />
        <AuthenticatedDrawer.Screen name="Payments" component={PaymentScreen} />
        <AuthenticatedDrawer.Screen name="Help Center" component={RootScreen} />
        <AuthenticatedDrawer.Screen name="Settings" component={SettingsScreen} />
        <AuthenticatedDrawer.Screen options={{ unmountOnBlur: true }} name="Listing Item" component={ListingItem} />

        <AuthenticatedDrawer.Screen name="Chat" component={Chat} />
        <AuthenticatedDrawer.Screen name="QR Code" component={QRCode} />
        <AuthenticatedDrawer.Screen options={{ unmountOnBlur: true }} name="Complete Job" component={CompleteJob} />
        <AuthenticatedDrawer.Screen name="Job Details" component={JobDetails} />
      </AuthenticatedDrawer.Navigator>
    </NavigationContainer>
  );
}

function DrawerContent({ navigation }) {
  const { authActions, authState } = useContext(GlobalContext);
  const { signOut } = authActions;

  return (
    <View style={{ flex: 1 }}>
      <DrawerHeader
        style={
          authState.userData.role === "contractor"
            ? { backgroundColor: theme.contractor.profile_background }
            : { backgroundColor: theme.project_manager.profile_background }
        }
      >
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <Row>
            <Column>
              <ProfilePicture style={{ backgroundColor: '#3332' }} source={{ uri: `${env.API_URL}${authState.userData.profile_picture}` }} />
            </Column>
            <Column>
              <DrawerText title>
                {authState.userData.first_name} {authState.userData.last_name}
              </DrawerText>
              <DrawerText medium bold>
                <FontAwesome name="star" size={17} color="white" /> {authState.userData.star_rate}
              </DrawerText>
            </Column>
          </Row>
        </TouchableWithoutFeedback>
      </DrawerHeader>
      <DrawerContentScrollView bounces={false} contentInset={{ top: -50 }}>
        {authState.userData.role == "contractor" ? (
          <DrawerItem
            labelStyle={{ fontSize: 20 }}
            label="Work History"
            onPress={() => navigation.navigate("Work History")}
            icon={() => <MaterialIcons name="history" size={24} color="black" />}
          />
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Job Listings", { screen: "Root" })}>
              <DrawerItemAlternative>
                <DrawerIcon>
                  <Entypo name="megaphone" size={24} color="black" />
                </DrawerIcon>
                <Text color="#555" style={{ fontSize: 21, marginLeft: 5, fontWeight: "400" }}>
                  <GigChaserJobWord color="#555" width="60px" height="20px" /> Listings
                </Text>
              </DrawerItemAlternative>
            </TouchableOpacity>
            {/* <DrawerItem
              labelStyle={{ fontSize: 20 }}
              label="Job Listings"
              onPress={() => navigation.navigate("Job Listings", { screen: "Root" })}
              icon={() => <Entypo name="megaphone" size={24} color="black" />}
            /> */}
            {/* <DrawerItem
              labelStyle={{ fontSize: 20 }}
              label="Messages"
              onPress={() => navigation.navigate("Messages")}
              icon={() => <MaterialIcons name="chat" size={24} color="black" />}
            /> */}
            {/* <DrawerItem
              labelStyle={{ fontSize: 20 }}
              label="Scan QR Code"
              onPress={() => navigation.navigate("Scanner")}
              icon={() => <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />}
            /> */}
            {/* <TouchableOpacity onPress={() => navigation.navigate("Work History")}>
              <DrawerItemAlternative>
                <DrawerIcon>
                  <MaterialIcons name="history" size={24} color="black" />
                </DrawerIcon>
                <Text color="#555" style={{ fontSize: 21, marginLeft: 5, fontWeight: "400" }}>
                  <GigChaserJobWord color="#555" width="60px" height="20px" />
                  History
                </Text>
              </DrawerItemAlternative>
            </TouchableOpacity> */}
            {/* <DrawerItem
              labelStyle={{ fontSize: 20 }}
              label="Work History"
              onPress={() => navigation.navigate("Work History")}
              icon={() => <MaterialIcons name="history" size={24} color="black" />}
            /> */}
          </>
        )}
        <DrawerItem
          labelStyle={{ fontSize: 20 }}
          label="Payments"
          onPress={() => navigation.navigate("Payments")}
          icon={() => <Entypo name="wallet" size={24} color="black" />}
        />
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
          onPress={() => signOut(authState.userToken)}
          icon={() => <MaterialIcons name="exit-to-app" size={24} color="black" />}
        />
      </SafeAreaView>
    </View>
  );
}

const DrawerItemAlternative = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DrawerIcon = styled.View`
  margin: 17px;
`;

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

const DrawerText = styled.Text`
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


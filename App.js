// IMPORTS
import React, { useEffect, useReducer } from "react";
import { View, ActivityIndicator, Text, TextInput } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

// Navigation
// navigation.navigate("screenName") Adds another screen into the stack.
// navigation.goBack() remove one screen from the stack. In other words goes back to previous screen.
// navigation.popToTop() goes back to first screen in stack

// Passing data to routes
// navigation.navigate('RouteName', { /* params go here */ }) // pass data as params (props) between screens. (props.route): route.params
// Note: navigation.navigate("routeName", {}) if the screen is below, it will work as goBack() function and you can send data back

// REACT NATIVE NAVIGATION 5 IMPORTS
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NotAuthenticatedStackScreen } from "./screens/not-authenticated/root/stack";
import { AuthenticatedStackScreen } from "./screens/authenticated/root/stack";

// Example
// import { Example } from "./screens/example";
import Example from "./views/65";

import { AuthContext } from "./components/context";

const Drawer = createDrawerNavigator();

// Disable Font Scaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#548ff7",
  },
};

export default function App({ navigation }) {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        // parameter foundUser: Array, Length: 1, Contains: Username and Token properties
        // Fetch from Server API (DEMOSTRATION)
        const userToken = String(foundUser[0].userToken);
        const userName = foundUser[0].username;
        try {
          await AsyncStorage.setItem("userToken", userToken);
        } catch (e) {}
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {}
        dispatch({ type: "LOGOUT" });
      },
      signUp: () => {},
    }),
    []
  );

  useEffect(() => {
    // setTimeout(async () => {
    setTimeout(async () => {
      let userToken = null;
      try {
        // Get TOKEN from AsyncStorage
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        // console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 1000);
    // }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <Container>
        <HeaderBox>
          <IconLeft>
            <Ionicons
              name="md-trash"
              size={25}
              color="#6A6A6A"
              onPress={() => navigation.goBack()}
            />
          </IconLeft>

          <IconRight>
            <Entypo
              name="star"
              size={25}
              color="#34C5EB"
              onPress={() => navigation.goBack()}
            />
          </IconRight>
        </HeaderBox>

        <ContentBox>
          <ImageProfile source={require("./assets/Ellipse_1.png")} />
   <ContentColum>
   <ContentInfo>
            <StyledText style={{ fontWeight: "bold" }}>_domakeup</StyledText>
            <StyledText>Daniela Ordoñez</StyledText>
          </ContentInfo>
          <ContentFollow>
            <ContentData>
               <StyledText style={{ fontWeight: "bold" }}>100k</StyledText>
          <StyledText>Seguidores</StyledText>
            </ContentData>
            <ContentData>
                  <StyledText style={{ fontWeight: "bold" }}>9.9</StyledText>
         <StyledText>Rating</StyledText>
            </ContentData>
        

          </ContentFollow>
   </ContentColum>
        </ContentBox>
        <ButtonBox>
          <FollowBtn>Seguir</FollowBtn>
          <ShareBtn>Compartir</ShareBtn>
        </ButtonBox>
      </Container>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={Theme}>
        {loginState.userToken ? (
          <>
            {/* <AuthenticatedStackScreen /> */}
            <Example />
          </>
        ) : (
          <>
            {/* <NotAuthenticatedStackScreen /> */}
            <Example />
          </>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const Container = styled.View`
  flex: 0.4;
  flex-direction: column;
  margin-top: 35px;
  justify-content: flex-end;
  margin-left: 10px;
  margin-right: 10px;
  /* background:red;  */
  border-width: 1px;
  border-color: #e6e6e6;

  border-radius: 10px;
`;

const IconLeft = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  margin-right: 10px;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const IconRight = styled.View`
  flex: 1;
  justify-content: flex-end;
  flex-direction: row;
  margin-right: 20px;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const ButtonBox = styled.View`
  /* background:yellow; */
  flex-direction: row;
`;

const ContentBox = styled.View`
  flex: 1.4;

  /* background: red; */
  flex-direction: row;
`;

const HeaderBox = styled.View`
  flex: 0.4;
  /* background: yellow; */
  flex-direction: row;
`;

const FollowBtn = styled.Text`
  padding: 20px;
  width: 50%;
  text-align: center;
  border-width: 1px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  border-color: #e6e6e6;
  font-size: 18px;
`;

const ShareBtn = styled.Text`
  padding: 20px;
  width: 50%;
  text-align: center;
  border-width: 1px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-color: #e6e6e6;
  font-size: 18px;
`;

const ImageProfile = styled.Image`
  width: 135px;
  height: 135px;
  margin-left: 16px;
  margin-right: 5px;
`;

const StyledText = styled.Text`
  text-align: center;
  margin: 5px;
  font-size:18px;
`;

const ContentInfo = styled.View`
  flex: 0.5;
  /* background: green; */
`;

const ContentData = styled.View`
  flex: 1;
  /* background: blueviolet; */
`;

const ContentFollow = styled.View`
 flex:0.5;
 flex-direction:row;
  /* background: purple; */
`;

const ContentColum = styled.View`
flex:1;
flex-direction:column;
  /* background: purple; */
`;

export default contractorApp;

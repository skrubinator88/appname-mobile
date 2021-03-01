import React, { Component, useContext, useState, useEffect, useRef } from "react";

import { Image, Button, Alert, TextInput, View, Animated, Easing, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { StackActions } from "@react-navigation/native";

// Styling
import { Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../../../theme.json";

// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import { GlobalContext } from "../../../components/context";
import env from "../../../env";

// Controller
import JobController from "../../../controllers/JobsControllers";

const isIos = Platform.OS === "ios";
const SPACER_SIZE = Dimensions.get("window").height / 2; //arbitrary size
const width = Dimensions.get("window").width; //arbitrary size

export default function ProfileScreen({ navigation }) {
  const global = useContext(GlobalContext);
  const { authActions, authState, errorActions, appActions, appState } = useContext(GlobalContext);
  const { userData, userID } = authState;

  const [role, setRole] = useState(userData.role);
  const [roleSwitch, setRoleSwitch] = useState(role == "contractor" ? false : true);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [isMounted, setMounted] = useState(false);

  const ANIMATION_DURATION = 200;
  const ANIMATION_EASING = () => {
    return Easing.inOut(Easing.exp);
  };

  useEffect(() => {
    setRole(global.authState.userData.role);
  }, [global]);

  useEffect(() => {
    JobController.getUserJobComments(userID, { setComments });
  }, []);

  // React navigation "onMounted lifecycle"
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", (e) => {
  //     // Prevent default action
  //     console.log("Hey");
  //   });

  //   return () => unsubscribe();
  // }, []);

  const slide = useRef(new Animated.Value(role == "contractor" ? width / 4 : 0)).current;

  const changeRoleCallback = (role) => {
    authActions.changeRole(authState, role);
  };

  const slideRight = () => {
    // appActions.setLoading(true);
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(slide, {
      toValue: width / 4,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING(),
      useNativeDriver: false,
    }).start(changeRoleCallback("contractor"));
  };

  const slideLeft = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(slide, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING(),
      useNativeDriver: false,
    }).start(changeRoleCallback("project_manager"));
  };

  const handleChangeRole = () => {
    roleSwitch ? slideRight() : slideLeft();
    setRoleSwitch(!roleSwitch);
  };

  return (
    <Container
      navigation={navigation}
      // flexible={false}
      titleColor="white"
      headerBackground={authState.userData.role == "contractor" ? theme.contractor.primary : theme.project_manager.primary}
      endBackground="white"
      // nextAction={() => {}}
      // nextTitle="Save"
      // nextProvider="Entypo"
      // nextIcon="dots-three-horizontal"
      title={loading ? () => <ActivityIndicator color="white" size={20} /> : ""}
      enableRefreshFeedback={true}
      refreshingProperties={{ refreshing: false, tintColor: "white", onRefresh: () => {} }}
    >
      {/* Profile Section */}

      <ProfileSection
        style={
          authState.userData.role == "contractor"
            ? { backgroundColor: theme.contractor.primary }
            : { backgroundColor: theme.project_manager.primary }
        }
      >
        <View style={{ justifyContent: "center", alignContent: "center", flex: 1, width: 100, height: 100 }}>
          <ProfilePicture source={{ uri: `${env.API_URL}${userData.profile_picture}` }} onLoad={() => setLoading(false)} />
        </View>

        <Text title color="white" weight="700">
          {userData.first_name} {userData.last_name}
        </Text>
        <Text medium color="white" weight="300">
          {userData.occupation}
        </Text>

        <TouchableWithoutFeedback onPress={() => handleChangeRole()}>
          <ChangeRoleSlider
            style={
              authState.userData.role == "contractor"
                ? { backgroundColor: theme.contractor.darker }
                : { backgroundColor: theme.project_manager.darker }
            }
          >
            <Animated.View style={{ top: 0, left: slide, position: "absolute" }}>
              <Selector
                style={
                  authState.userData.role == "contractor"
                    ? { backgroundColor: theme.contractor.brighter }
                    : { backgroundColor: theme.project_manager.brighter }
                }
              />
            </Animated.View>

            <Text color="white">Deployer</Text>
            <Text color="white">Deployee</Text>
          </ChangeRoleSlider>
        </TouchableWithoutFeedback>

        <Row>
          <Column>
            <Text title color="white" weight="700">
              {userData.star_rate} <FontAwesome name="star" size={25} />
            </Text>
            <Text medium weight="300" color="white">
              Rating
            </Text>
          </Column>
          <Column>
            <Text title color="white" weight="700">
              8
            </Text>
            <Text medium weight="300" color="white">
              Months
            </Text>
          </Column>
        </Row>
      </ProfileSection>

      {/* Details Section */}

      <DetailSection>
        <DetailItemRow>
          <DetailItemColumn>
            <Text small weight="700" color="#4a4a4a">
              PHONE
            </Text>
            <Text small weight="300">
              {userData.phone_number}
            </Text>
          </DetailItemColumn>
        </DetailItemRow>

        <DetailItemRow>
          <DetailItemColumn>
            <Text small weight="700" color="#4a4a4a">
              EMAIL
            </Text>
            <Text small weight="300">
              {userData.email}
            </Text>
          </DetailItemColumn>
        </DetailItemRow>

        <DetailItemRow>
          <DetailItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              SKILLS & LICENSES
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </DetailItemRowLink>
        </DetailItemRow>

        <DetailItemRow onPress={() => navigation.navigate("Background Check")}>
          <DetailItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              PERFORM A BACKGROUND CHECK
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </DetailItemRowLink>
        </DetailItemRow>
      </DetailSection>

      {/* Comments Section */}

      <CommentSection>
        <CommentSectionColumn>
          <CommentTitleRowAndLink>
            <Text medium weight="700">
              Comments
            </Text>
            {comments.length > 3 && (
              <Text small weight="700" color="#a0a0a0">
                View All
              </Text>
            )}
          </CommentTitleRowAndLink>

          <Comments>
            {comments.length == 0 && (
              <CommentItem key="not found" style={{ justifyContent: "center", alignItems: "center" }}>
                <MaterialCommunityIcons name="comment-outline" size={width * 0.3} color="#999" />
                <Text color="#999" bold>
                  There are not comments yet.
                </Text>
              </CommentItem>
            )}

            {comments.map(({ first_name, last_name, text, posted_by, id }) => (
              <CommentItem key={id}>
                <Text small bold>
                  {first_name} {last_name}
                </Text>
                <Text>{text}</Text>
              </CommentItem>
            ))}
          </Comments>
        </CommentSectionColumn>
      </CommentSection>
    </Container>
  );
}

const Selector = styled.View`
  width: ${width / 4}px;
  height: 40px;
  border-radius: 50px;
`;

const ChangeRoleSlider = styled.View`
  width: ${width / 2}px;
  height: 40px;
  margin: 20px;
  border-radius: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const ProfileSection = styled.View`
  justify-content: center;
  align-items: center;
`;

const ProfilePicture = styled.Image`
  height: 100px;
  width: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const Row = styled.View`
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Details Section

const DetailSection = styled.View`
  background: white;
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const DetailItemRow = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const DetailItemColumn = styled.View`
  width: 100%;
  padding: 3px 5%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const DetailItemRowLink = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Comments Section

const CommentSection = styled.View`
  background: white;
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const CommentSectionRow = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
  padding: 15px 0px;
`;

const CommentSectionColumn = styled.View`
  flex-direction: column;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
  padding: 15px 0px;
`;

const CommentItemColumn = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CommentTitleRowAndLink = styled.View`
  width: 100%;
  padding: 0 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Compliments = styled.ScrollView`
  width: 100%;
  flex-direction: row;
`;

const ComplimentItem = styled.View`
  margin: 40px 10px;
  background: #0070a0;
  border-radius: 7px;
  width: 150px;
  padding: 20px 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Comments = styled.View`
  width: 100%;
  flex-direction: column;
`;

const CommentItem = styled.View`
  padding: 10px 30px;
`;

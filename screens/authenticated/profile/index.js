import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { requestPermissionsAsync } from "expo-camera";
import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, Platform, TouchableWithoutFeedback, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { GlobalContext } from "../../../components/context";
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import JobController from "../../../controllers/JobsControllers";
import env from "../../../env";
import theme from "../../../theme.json";
import { JobCamera } from "../listings/listingItem";




const width = Dimensions.get("window").width; //arbitrary size

export default function ProfileScreen({ navigation })
{
  const global = useContext(GlobalContext);
  const { authActions, authState, } = useContext(GlobalContext);
  const { userData, userID } = authState;

  const [role, setRole] = useState(userData.role);
  const [roleSwitch, setRoleSwitch] = useState(role == "contractor" ? false : true);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  // Setup Profile Picture Selection
  const [profilePictureURI, setProfilePictureURI] = useState(`${env.API_URL}${userData.profile_picture}`);
  const [loadingMedia, setloadingMedia] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const [showCamera, setShowCamera] = useState(false);

  const slide = useRef(new Animated.Value(role == "contractor" ? width / 4 : 0)).current;

  const ANIMATION_DURATION = 200;
  const ANIMATION_EASING = () =>
  {
    return Easing.inOut(Easing.exp);
  };

  useEffect(() =>
  {
    setRole(global.authState.userData.role);
  }, [global]);

  useEffect(() =>
  {
    retrieveComments();
  }, []);

  async function retrieveComments()
  {
    setLoading(true)
    setComments([]);
    try
    {
      await JobController.getUserJobComments(userID, { setComments, limit: 3 });
    } catch (e)
    {
      console.log(e)
      Alert.alert('Failed to retrieve user comments', e.message)
    } finally
    {
      setLoading(false)
    }
  }

  // Functions
  const handleProfilePictureUpload = useCallback(async () =>
  {
    try
    {
      // Send picture to server
      // Set picture in Redux
      // setProfilePictureURI(res.uri);
    } catch {
    } finally
    {
    }
  }, [profilePictureURI]);

  const getPhoto = useCallback(async () =>
  {
    try
    {
      showActionSheetWithOptions(
        {
          options: ["Capture Photo", "Select From Library", "Cancel"],
          title: "Select Photo",
          message: "You can select a photo from your library or capture a new photo",
          cancelButtonIndex: 2,
          useModal: true,
        },
        async (i) =>
        {
          switch (i)
          {
            case 0:
              getPhotoFromCamera();
              break;
            case 1:
              getPhotoFromLibrary();
              break;
          }
        }
      );
    } catch (e)
    {
      console.log(e);
      Alert.alert("Failed To Select Photo", e.message);
    }
  }, [profilePictureURI]);

  const getPhotoFromLibrary = useCallback(async () =>
  {
    try
    {
      setloadingMedia(true);
      if (Platform.OS === "ios")
      {
        let perms = await requestMediaLibraryPermissionsAsync();
        if (!perms.granted)
        {
          Alert.alert("Access to media library denied", "You need to grant access to image library to continue");
          setloadingMedia(false);
          return;
        }
      }
      let res = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });

      if (!res.cancelled)
      {
        setProfilePictureURI(res.uri);
      }
    } catch (e)
    {
      console.log(e);
      Alert.alert(e.message);
    } finally
    {
      setloadingMedia(false);
    }
  }, [profilePictureURI]);

  const getPhotoFromCamera = useCallback(async () =>
  {
    try
    {
      setloadingMedia(true);

      let hasPermission = false;
      await (async () =>
      {
        const { status } = await requestPermissionsAsync();
        hasPermission = status === "granted";
      })();

      if (hasPermission !== true)
      {
        Alert.alert("Camera Access Required", "The application requires permission to use your camera");
        return;
      }

      setShowCamera(true);
    } catch (e)
    {
      console.log(e);
      Alert.alert("Failed To Capture Photo", e.message);
    } finally
    {
      setloadingMedia(false);
    }
  }, [profilePictureURI]);

  const changeRoleCallback = (role) =>
  {
    authActions.changeRole(authState, role);
  };

  const slideRight = () =>
  {
    // appActions.setLoading(true);
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(slide, {
      toValue: width / 4,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING(),
      useNativeDriver: false,
    }).start(changeRoleCallback("contractor"));
  };

  const slideLeft = () =>
  {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(slide, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING(),
      useNativeDriver: false,
    }).start(changeRoleCallback("project_manager"));
  };

  const handleChangeRole = () =>
  {
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
      refreshingProperties={{
        refreshing: false,
        tintColor: "white",
        onRefresh: () =>
        {
          retrieveComments();
        },
      }}
    >
      {/* Profile Section */}

      <ProfileSection
        style={
          authState.userData.role == "contractor"
            ? { backgroundColor: theme.contractor.primary }
            : { backgroundColor: theme.project_manager.primary }
        }
      >
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            flex: 1,
            width: 100,
            height: 100,
            backgroundColor: loading ? "#333" : "#3331",
            borderRadius: 50,
            opacity: loading ? 0.3 : 1,
            margin: 10,
          }}
        >
          <TouchableOpacity onPress={getPhoto}>
            <ProfilePicture source={{ uri: profilePictureURI }} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} />
          </TouchableOpacity>
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

        <DetailItemRow>
          <DetailItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              PREFERRED SKILLS
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
            {comments.length == 3 && (
              <TouchableWithoutFeedback onPress={() => navigation.navigate("Comments", { comments, userID })}>
                <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                  <Text small weight="700" color="#a0a0a0">
                    View All
                  </Text>
                </View>
              </TouchableWithoutFeedback>
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

            <RenderIndividualComments items={comments} />
          </Comments>
        </CommentSectionColumn>
      </CommentSection>

      <JobCamera
        showCamera={showCamera}
        onSuccess={async (res) =>
        {
          if (!res)
          {
            return setShowCamera(false);
          }
          // console.log(res);
          try
          {
            if (!res.cancelled)
            {
              handleProfilePictureUpload(res.uri);
            }
          } catch (e)
          {
            console.log(e);
            Alert.alert(e.message || "Failed to add photo");
          } finally
          {
            setShowCamera(false);
          }
        }}
      />
    </Container>
  );
}

function RenderIndividualComments({ items })
{
  if (items.length > 0)
  {
    const final = [];
    for (let i = 0; i < items.length; i++)
    {
      let { first_name, last_name, text, id } = items[i];
      final.push(
        <CommentItem key={id}>
          <Text small bold>
            {first_name} {last_name}
          </Text>
          <Text>{text}</Text>
        </CommentItem>
      );
    }
    return final;
  }
  return <View></View>;
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


const CommentSectionColumn = styled.View`
  flex-direction: column;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
  padding: 15px 0px;
`;


const CommentTitleRowAndLink = styled.View`
  width: 100%;
  padding: 0 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;



const Comments = styled.View`
  width: 100%;
  flex-direction: column;
`;

const CommentItem = styled.View`
  padding: 10px 30px;
`;

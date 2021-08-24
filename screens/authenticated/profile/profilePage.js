import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, TouchableWithoutFeedback, View } from "react-native";
import styled from "styled-components/native";
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import JobController from "../../../controllers/JobsControllers";
import env from "../../../env";
import theme from "../../../theme.json";

const width = Dimensions.get("window").width; //arbitrary size

export function ProfilePage({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const route = useRoute();
  const { userData } = route.params || {}

  if (!userData) {
    Alert.alert("User not found", undefined, [{ style: "cancel", onPress: () => navigation.goBack() }])

    return (
      <View>
        <ActivityIndicator color="black" size={20} />
      </View>
    )
  }

  useEffect(() => {
    retrieveComments();
  }, []);

  async function retrieveComments() {
    setLoading(true)
    setComments([]);
    try {
      await JobController.getUserJobComments(userData.id, { setComments, limit: 3 });
    } catch (e) {
      console.log(e)
      Alert.alert('Failed to retrieve user comments', e.message)
    } finally {
      setLoading(false)
    }
  }

  const role = userData.role;

  return (
    <Container
      navigation={navigation}
      titleColor="white"
      headerBackground={role === "contractor" ? theme.contractor.profile_background : theme.project_manager.profile_background}
      endBackground="white"
      title={loading ? () => <ActivityIndicator color="white" size={20} /> : ""}
      enableRefreshFeedback={true}
      refreshingProperties={{
        refreshing: false,
        tintColor: "white",
        onRefresh: () => {
          retrieveComments();
        },
      }}
    >
      {/* Profile Section */}

      <ProfileSection
        style={
          role === "contractor"
            ? { backgroundColor: theme.contractor.profile_background }
            : { backgroundColor: theme.project_manager.profile_background }
        }
      >
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            flex: 1,
            width: 100,
            height: 100,
            backgroundColor: loading ? "#000" : "#333",
            borderRadius: 50,
            opacity: loading ? 0.3 : 1,
            margin: 10,
          }}
        >
          <View>
            <ProfilePicture source={{ uri: `${env.API_URL}${userData.profile_picture}` }} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} />
          </View>
        </View>

        <Text title color="white" weight="700">
          {userData.first_name} {userData.last_name}
        </Text>
        <Text medium color="white" weight="300">
          {userData.occupation}
        </Text>
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
        <DetailItemRow activeOpacity={1}>
          <DetailItemColumn>
            <Text small weight="700" color="#4a4a4a">
              PHONE
            </Text>
            <Text small weight="300">
              {userData.phone_number}
            </Text>
          </DetailItemColumn>
        </DetailItemRow>

        <DetailItemRow activeOpacity={1}>
          <DetailItemColumn>
            <Text small weight="700" color="#4a4a4a">
              EMAIL
            </Text>
            <Text small weight="300">
              {userData.email}
            </Text>
          </DetailItemColumn>
        </DetailItemRow>

        <DetailItemRow activeOpacity={1}>
          <DetailItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              SKILLS & LICENSES
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </DetailItemRowLink>
        </DetailItemRow>

        <DetailItemRow> 
          {/* onPress={() => navigation.navigate("Background Check")}> */}
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

    </Container>
  );
}

function RenderIndividualComments({ items }) {
  if (items.length > 0) {
    const final = [];
    for (let i = 0; i < items.length; i++) {
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

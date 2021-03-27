// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";

// Styling
import Text from "../../../components/text";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import styled from "styled-components/native";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

import { createStackNavigator } from "@react-navigation/stack";
export const ProfileStack = createStackNavigator();

import Container from "../../../components/headerAndContainer";
import theme from "../../../theme.json";
import { GlobalContext } from "../../../components/context";

import JobController from "../../../controllers/JobsControllers";

export default function CommentsScreen({ navigation, route }) {
  const { authState } = useContext(GlobalContext);

  // state
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    JobController.getUserJobComments(route.params.userID, { setComments });
    setLoading(false);
  }, []);

  function refresh() {
    setComments([]);
    JobController.getUserJobComments(route.params.userID, { setComments });
  }

  return (
    <Container
      navigation={navigation}
      titleColor="white"
      headerBackground={authState.userData.role == "contractor" ? theme.contractor.primary : theme.project_manager.primary}
      enableRefreshFeedback={true}
      loadingContent={loading}
      refreshingProperties={{
        refreshing: false,
        tintColor: "white",
        onRefresh: () => refresh(),
      }}
    >
      {!loading && (
        <View style={{ height: comments.length < 5 ? height / 1.3 : null }}>
          <CommentSection>
            <CommentSectionColumn>
              <CommentTitleRowAndLink>
                <Text medium weight="700">
                  Comments
                </Text>
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

                {/* <RenderIndividualComments items={comments} /> */}
              </Comments>
            </CommentSectionColumn>
          </CommentSection>
        </View>
      )}
    </Container>
  );
}

// function RenderIndividualComments({ items }) {
//   const final = [];

//   for (let i = 0; i < items.length; i++) {
//     let { first_name, last_name, text, posted_by, id } = items[i];

//     final.push(
//       <CommentItem key={id}>
//         <Text small bold>
//           {first_name} {last_name}
//         </Text>
//         <Text>{text}</Text>
//       </CommentItem>
//     );
//   }

//   return <Text>{final}</Text>;
// }

const CommentSection = styled.View`
  background: white;
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const CommentTitleRowAndLink = styled.View`
  width: 100%;
  padding: 0 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CommentSectionColumn = styled.View`
  flex-direction: column;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
  padding: 15px 0px;
`;

const Comments = styled.View`
  width: 100%;
  flex-direction: column;
`;

const CommentItem = styled.View`
  padding: 10px 30px;
`;

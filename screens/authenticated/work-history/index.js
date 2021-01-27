import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import styled from "styled-components/native";

// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import { useTheme } from "@react-navigation/native";
import env from "../../../env";

// Styling
import { Entypo, Octicons, Feather } from "@expo/vector-icons";

// Controllers
import JobsController from "../../../controllers/JobsControllers";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Functions
import { convertFirestoreTimestamp } from "../../../functions";

// Context
import { GlobalContext } from "../../../components/context";

// Miscellaneous
import { getStatusBarHeight } from "react-native-status-bar-height";
const statusBarHeight = getStatusBarHeight();
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function WorkHistory({ navigation }) {
  const { authActions, authState, errorActions } = useContext(GlobalContext);

  const { colors } = useTheme();
  const [jobs, setJobs] = useState([]);

  // Subscribe to messages firebase
  useEffect(() => {
    // const unsubscribe = JobsController.getMyJobHistory(authState.userID, setJobs);

    return () => {
      setJobs([]);
      // unsubscribe();
    };
  }, []);

  return (
    <Container navigation={navigation} headerBackground={colors.primary} backColor="white" style={{ backgroundColor: "red" }}>
      {jobs.map((job) => (
        // Visualize job
        <WorkHistoryItem data={job} />
      ))}
      {jobs.length <= 0 && (
        <NoMessageBanner>
          <Feather name="file-text" size={width * 0.4} color="#ccc" style={{ margin: 20 }} />
          <Text bold color="#ccc">
            You have not completed any work.
          </Text>
          <Text bold color="#ccc">
            Start now! Many opportunities are waiting for you.
          </Text>
        </NoMessageBanner>
      )}
    </Container>
  );
}

function WorkHistoryItem({ data }) {
  const { colors } = useTheme();
  const [time, setTime] = useState("");
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [receiver, setReceiver] = useState();
  const { authActions, authState, errorActions } = useContext(GlobalContext);

  return (
    <>
      <TouchableOpacity style={{ flexDirection: "row", padding: 10, alignItems: "center" }} onPress={() => {}}></TouchableOpacity>

      <Divider />
    </>
  );
}

const Divider = styled.View`
  border: 0.5px solid #dadada;
`;

const NoMessageBanner = styled.View`
  height: ${height - statusBarHeight * 4}px;
  justify-content: center;
  align-items: center;
`;

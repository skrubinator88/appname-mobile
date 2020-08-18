import React, { useState, useMemo, useEffect, useContext } from "react";
import { Text } from "react-native";

// Card UI Components
import Dashboard from "./dashboard";
import Searching from "./searching";
import JobFound from "./jobFound";
import AcceptedJob from "./acceptedJob";

// import Example from "./example";
import { GlobalContext } from "../../../../components/context";
import { UIOverlayContext } from "../../../../components/context";

// Store

// Reducers

// Actions
import OverlayActions from "../../../../actions/OverlayActions";

function HandleOverlayUIContractorComponents({ route, navigation, data }) {
  switch (route) {
    case "dashboard":
      return <Dashboard navigation={navigation} />;
      break;
    case "searching":
      return <Searching navigation={navigation} data={data} />;
      break;
    case "jobFound":
      return <JobFound navigation={navigation} data={data} />;
      break;
    case "acceptedJob":
      return <AcceptedJob navigation={navigation} data={data} />;
      break;
    case "example":
      return <Example navigation={navigation} />;
      break;
  }
}

function HandleOverlayUIProjectManagerComponents({ route, navigation, data }) {
  switch (route) {
    case "dashboard":
      return <Dashboard navigation={navigation} />;
      break;
    case "searching":
      return <Searching navigation={navigation} data={data} />;
      break;
    case "jobFound":
      return <JobFound navigation={navigation} data={data} />;
      break;
    case "acceptedJob":
      return <AcceptedJob navigation={navigation} data={data} />;
      break;
    case "example":
      return <Example navigation={navigation} />;
      break;
  }
}

export default function UIComponents({ navigation, jobPostings, onMoveCamera }) {
  const [route, setRoute] = useState("dashboard");
  const { authContext, authState, errorContext } = useContext(GlobalContext);
  const { userToken, userID, userData } = authState;

  const thisComponentState = { setRoute };
  const uiOverlayContext = OverlayActions.memo(thisComponentState);

  return (
    <UIOverlayContext.Provider value={uiOverlayContext}>
      {userData.role == "contractor" ? (
        <HandleOverlayUIContractorComponents route={route} navigation={navigation} data={jobPostings} />
      ) : (
        // <HandleOverlayUIComponents route={route} navigation={navigation} data={jobPostings} />
        <Text>Under Construction</Text>
      )}
    </UIOverlayContext.Provider>
  );
}

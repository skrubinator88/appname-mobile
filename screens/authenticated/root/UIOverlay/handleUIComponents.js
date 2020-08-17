import React, { useState, useMemo, useEffect, useContext } from "react";
import { Text } from "react-native";

// Card UI Components
import Dashboard from "./dashboard";
import Searching from "./searching";
import JobFound from "./jobFound";
import AcceptedJob from "./acceptedJob";

// import Example from "./example";
import { AuthContext } from "../../../../components/context";
import { UIOverlayContext } from "../../../../components/context";

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
  const { authContext, globalState } = useContext(AuthContext);
  const { getUserInfo } = authContext;
  const { userToken, userID, userData } = globalState;

  const uiOverlayContext = React.useMemo(
    () => ({
      changeRoute: (newRoute) => {
        setRoute(newRoute);
      },
      moveCamera: (location) => {
        onMoveCamera(location);
      },
    }),
    []
  );

  return (
    <UIOverlayContext.Provider value={uiOverlayContext}>
      {userData.role == "contractor" ? (
        // Project Manager
        <HandleOverlayUIContractorComponents route={route} navigation={navigation} data={jobPostings} />
      ) : (
        // Contractor
        // <HandleOverlayUIComponents route={route} navigation={navigation} data={jobPostings} />
        <Text>Under Construction</Text>
      )}
    </UIOverlayContext.Provider>
  );
}

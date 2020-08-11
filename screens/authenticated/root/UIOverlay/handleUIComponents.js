import React, { useState, useMemo, useEffect, useContext } from "react";

// Card UI Components
import Dashboard from "./dashboard";
import Searching from "./searching";
import JobFound from "./jobFound";
import AcceptedJob from "./acceptedJob";

// import Example from "./example";
import { AuthContext } from "../../../../components/context";
import { UIOverlayContext } from "../../../../components/context";

function HandleOverlayUIComponents({ route, navigation, data }) {
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
  const { getRole } = useContext(AuthContext);

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
      {getRole() == "project_manager" ? (
        // Project Manager
        <HandleOverlayUIComponents route={route} navigation={navigation} data={jobPostings} />
      ) : (
        // Contractor
        <HandleOverlayUIComponents route={route} navigation={navigation} data={jobPostings} />
      )}
    </UIOverlayContext.Provider>
  );
}

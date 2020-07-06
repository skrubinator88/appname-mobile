import React, { useState, useMemo, useEffect } from "react";

// Card UI Components
import Dashboard from "./dashboard";
import Searching from "./searching";
import JobFound from "./jobFound";
import AcceptedJob from "./acceptedJob";

// import Example from "./example";

import { UIOverlayContext } from "../../../../components/context";

function HandleOverlayUIComponents({ route, navigation }) {
  switch (route) {
    case "dashboard":
      return <Dashboard navigation={navigation} />;
      break;
    case "searching":
      return <Searching navigation={navigation} />;
      break;
    case "jobFound":
      return <JobFound navigation={navigation} />;
      break;
    case "acceptedJob":
      return <AcceptedJob navigation={navigation} />;
      break;
    case "example":
      return <Example navigation={navigation} />;
      break;
  }
}

export default function UIComponents({ navigation }) {
  const [route, setRoute] = useState("dashboard");

  const uiOverlayContext = React.useMemo(
    () => ({
      changeRoute: (newRoute) => {
        setRoute(newRoute);
      },
    }),
    []
  );

  useEffect(() => {
    
    return;
  }, [route]);

  return (
    <UIOverlayContext.Provider value={uiOverlayContext}>
      <HandleOverlayUIComponents route={route} navigation={navigation} />
    </UIOverlayContext.Provider>
  );
}

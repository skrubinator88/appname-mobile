import React, { useContext, useState } from "react";
// Actions
import OverlayActions from "../../../../actions/OverlayActions";
import { GlobalContext, UIOverlayContext } from "../../../../components/context";
import AcceptedJob from "./acceptedJob";
// Card UI Components
import Dashboard from "./dashboard";
import JobFound from "./jobFound";
import ReportJob from "./reportJob";
import Searching from "./searching";




function HandleOverlayUIContractorComponents({ route, navigation, location }) {
  switch (route.name) {
    case "dashboard":
      return <Dashboard navigation={navigation} {...route.props} />;
      break;
    case "searching":
      return <Searching navigation={navigation} {...route.props} />;
      break;
    case "job_found":
      return <JobFound navigation={navigation} {...route.props} />;
      break;
    case "acceptedJob":
      return <AcceptedJob navigation={navigation} {...route.props} />;
    case "Report Job":
      return <ReportJob navigation={navigation} {...route.props} />;
    case "example":
      return <Example navigation={navigation} {...route.props} />;
      break;
  }
}

function HandleOverlayUIProjectManagerComponents({ route, navigation, willUnmountSignal }) {
  switch (route.name) {
    case "dashboard":
      return <Dashboard navigation={navigation} {...route.props} />;
      break;
  }
}

export default function UIComponents({ navigation }) {
  // Initial Route also as Example
  const [route, setRoute] = useState({
    name: "dashboard",
    props: {
      /**
       * - - EXAMPLE - -
       * Put the data and the data key (name) here
       * that you might pass through props
       **/
      // data: "Some Data" or {name: "Some Data"} or ["Some Data"]
    },
  });

  // Authentication Context
  const { authActions, authState, errorActions } = useContext(GlobalContext);
  const { userToken, userID, userData } = authState;

  const thisComponentState = { setRoute };
  const uiOverlayContext = OverlayActions.memo(thisComponentState);

  return (
    <UIOverlayContext.Provider value={uiOverlayContext}>
      {userData.role == "contractor" ? (
        <HandleOverlayUIContractorComponents route={route} navigation={navigation} />
      ) : (
          <HandleOverlayUIProjectManagerComponents route={route} navigation={navigation} />
        )}
    </UIOverlayContext.Provider>
  );
}

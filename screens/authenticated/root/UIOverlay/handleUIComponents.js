import { useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
// Actions
import OverlayActions from "../../../../actions/OverlayActions";
import { GlobalContext, UIOverlayContext } from "../../../../components/context";
import { JOB_CONTEXT } from "../../../../contexts/JobContext";
import ListingItemSelected from "../../listings/listingItemSelected";
import AcceptedJob from "./acceptedJob";
// Card UI Components
import Dashboard from "./dashboard";
import JobFound from "./jobFound";
import Searching from "./searching";




function HandleOverlayUIContractorComponents({ route, navigation, location }) {
  const { current } = useContext(JOB_CONTEXT)
  const { changeRoute } = useContext(UIOverlayContext);

  useEffect(() => {
    if (current) {
      switch (current.status) {
        case 'available':
        case 'in review':
          changeRoute({ name: 'job_found', props: { keyword: current.job_type } })
          break
        case 'in progress':
        case 'accepted':
          changeRoute({ name: 'acceptedJob' })
          break
        default:
          if (route?.props?.keyword) {
            changeRoute({ name: 'searching', props: route.props })
          } else {
            changeRoute({ name: 'dashboard' })
          }
          break
      }
    } else {
      if (route?.props?.keyword) {
        setRoute({ name: 'searching', props: route.props })
      } else {
        setRoute({ name: 'dashboard' })
      }
    }
  }, [current?.status, route?.props?.keyword])

  switch (route.name) {
    case "dashboard":
      return <Dashboard navigation={navigation} {...route.props} />;
    case "searching":
      return <Searching navigation={navigation} {...route.props} />;
    case "job_found":
      return <JobFound navigation={navigation} {...route.props} />;
    case "acceptedJob":
      return <AcceptedJob navigation={navigation} {...route.props} />;
    case "example":
      return <Example navigation={navigation} {...route.props} />;
  }
}

function HandleOverlayUIProjectManagerComponents({ route, navigation, willUnmountSignal }) {
  switch (route.name) {
    case "dashboard":
      return <Dashboard navigation={navigation} {...route.props} />;
    case 'selected':
      return <ListingItemSelected navigation={navigation} {...route.props} />;
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
  const routeParams = useRoute().params || {}
  const { screen, data } = routeParams;
  useEffect(() => {
    switch (data) {
      case 'completedJob':
        setRoute({ name: 'dashboard' })
        navigation.setParams({ screen: undefined, data: undefined, item: undefined })
        break;
      case 'selected':
        setRoute({ name: 'selected' })
        navigation.setParams({ screen: undefined, data: undefined, item: undefined })
        break
    }
  }, [screen, data])

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

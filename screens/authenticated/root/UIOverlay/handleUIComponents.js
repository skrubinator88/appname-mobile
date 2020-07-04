import React from "react";

// Card UI Components
import Dashboard from "./dashboard";
import Searching from "./searching";
import JobFound from "./jobFound";
import AcceptedJob from "./acceptedJob";

// import Example from "./example";

export default function HandleCardUIComponents({ screen, navigation }) {
  switch ("dashboard") {
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

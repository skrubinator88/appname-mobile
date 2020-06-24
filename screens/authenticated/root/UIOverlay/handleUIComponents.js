import React from "react";

// Card UI Components
import Dashboard from "./dashboard";
import Searching from "./searching";
import JobFound from "./jobFound";

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
  }
}

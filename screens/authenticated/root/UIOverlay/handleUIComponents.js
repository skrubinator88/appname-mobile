import React from "react";

// Card UI Components
import Dashboard from "./dashboard";
import Searching from "./searching";
import JobFound from "./jobFound";

export default function HandleCardUIComponents({ screen }) {
  switch ("dashboard") {
    case "dashboard":
      return <Dashboard />;
      break;
    case "searching":
      return <Searching />;
      break;
    case "jobFound":
      return <JobFound />;
      break;
  }
}

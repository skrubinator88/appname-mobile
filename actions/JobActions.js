// Dependencies
import { useMemo } from "react";

exports.memo = ({ dispatch }) => {
  return useMemo(
    () => ({
      addJob: (e) => {
        dispatch({ type: "ADD", message: e });
      },
      clearJobQueue: () => {
        dispatch({ type: "CLEAR", message: e });
      },
      deleteJob: () => {
        dispatch({ type: "DELETE", message: e });
      },
      updateJob: () => {
        dispatch({ type: "UPDATE", message: e });
      },
    }),
    []
  );
};

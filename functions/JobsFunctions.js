// Dependencies
import { useMemo } from "react";

exports.memo = ({ dispatch }) => {
  return useMemo(
    () => ({
      addJob: (id, job) => {
        dispatch({ type: "ADD", id, job });
      },
      removeJob: (id) => {
        dispatch({ type: "DELETE", id });
      },
      updateJob: (id, job) => {
        dispatch({ type: "UPDATE", id, job });
      },
      clear: () => {
        dispatch({ type: "CLEAR" }); // Empty store
      },
    }),
    []
  );
};

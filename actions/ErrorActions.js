import { useMemo } from "react";

exports.memo = ({ dispatch }) => {
  return useMemo(
    () => ({
      setError: (e) => {
        dispatch({ type: "ERROR", message: e });
      },
    }),
    []
  );
};

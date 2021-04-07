// Dependencies
import { useMemo } from "react";

exports.memo = ({ dispatch }) => {
  return useMemo(
    () => ({
      setLoading: (boolean) => {
        dispatch({ type: "LOADING", boolean });
      },
    }),
    []
  );
};

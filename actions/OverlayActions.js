import { useMemo } from "react";

exports.memo = ({ setRoute, onMoveCamera }) => {
  return useMemo(
    () => ({
      changeRoute: (newRoute) => {
        setRoute(newRoute);
      },
    }),
    []
  );
};

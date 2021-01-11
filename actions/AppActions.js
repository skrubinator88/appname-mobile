// Dependencies
import { useMemo } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import PermissionsControllers from "../controllers/PermissionsControllers";
import env from "../env";
import axios from "axios";

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

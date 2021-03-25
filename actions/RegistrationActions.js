// Dependencies
import { useMemo } from "react";
import PermissionsControllers from "../controllers/PermissionsControllers";
import env from "../env";

exports.memo = ({ dispatch }) => {
  return useMemo(
    () => ({
      // General Functions
      updateForm: (form, formSended_Boolean) => {
        dispatch({ type: "UPDATE", form, formSended_Boolean });
      },
      addItemInField: (item, field) => {
        dispatch({ type: "PUSH", item, field });
      },
      updateItemFromField: (field, index, item) => {
        dispatch({ type: `UPDATE_FIELD_ITEM`, field, index, item });
      },
      deleteItemFromField: (field, index) => {
        dispatch({ type: `DELETE_FIELD_ITEM}`, field, index });
      },
    }),
    []
  );
};

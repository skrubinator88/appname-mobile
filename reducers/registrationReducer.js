const registrationReducer = (prevState, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...prevState,
        ...action.form,
        formSended: action.formSended || prevState.formSended,
      };

    case "PUSH": {
      let newState = {
        ...prevState,
      };
      newState[action.field].push(action.item);

      return newState;
    }

    case "UPDATE_FIELD_ITEM": {
      let newState = {
        ...prevState,
      };

      newState[action.field][action.index] = action.item;

      return newState;
    }

    case "DELETE_FIELD_ITEM": {
      let newState = {
        ...prevState,
      };

      newState[action.field].splice(action.index, 1);

      return newState;
    }

    case "DELETE":
      return {};
  }
};

export default registrationReducer;

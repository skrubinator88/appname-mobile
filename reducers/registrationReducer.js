const registrationReducer = (prevState, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...prevState,
        ...action.form,
        formSended: action.formSended || prevState.formSended,
      };

    case "PUSH":
      let newState = {
        ...prevState,
      };
      if (newState[action.field][action.item.id]) {
        newState[action.field][action.item.id] = action.item;
      } else {
        newState[action.field].push(action.item);
      }
      return newState;

    case "DELETE":
      return {};
  }
};

export default registrationReducer;

const loginReducer = (prevState, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...prevState,
        isLoading: action.boolean,
      };
  }
};

export default loginReducer;

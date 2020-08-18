const loginReducer = (prevState, action) => {
  switch (action.type) {
    case "ERROR":
      return {
        ...prevState,
        message: action.message,
      };
  }
};

export default loginReducer;

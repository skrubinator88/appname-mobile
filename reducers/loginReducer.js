const loginReducer = (prevState, action) => {
  switch (action.type) {
    case "RETRIEVE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        userID: action.id,
        userData: action.profile,
        isLoading: false,
      };
    case "LOGIN":
      return {
        ...prevState,
        userToken: action.token,
        userID: action.id,
        userData: action.profile,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...prevState,
        userToken: null,
        userID: null,
        userData: null,
        isLoading: false,
      };
    case "ERROR":
      return {
        ...prevState,
        errorMsg: action.message,
      };
    case "REGISTER":
      return {
        ...prevState,
        userToken: action.token,
        userID: action.id,
        userData: action.profile,
        isLoading: false,
      };
  }
};

export default loginReducer;

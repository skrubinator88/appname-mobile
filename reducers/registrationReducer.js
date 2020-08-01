const registrationReducer = (prevState, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...prevState,
        ...action.form,
        formSended: action.formSended,
      };
    // case "UPDATE":
    //   return {
    //     ...prevState,
    //     formSended: true,
    //   };
  }
};

export default registrationReducer;

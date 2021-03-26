const initalState = [];

const loginReducer = (prevState = initalState, action) => {
  switch (action.type) {
    case "ADD": {
      // console.log("ADDED");
      const data = action.job;
      data._id = action.id;
      const state = [...prevState];
      state.push(data);
      return state;
    }
    case "DELETE": {
      // console.log("DELETED");
      const index = [...prevState].findIndex((item) => item._id == action.id);
      const state = [...prevState];
      state.splice(index, 1);
      return state;
    }
    case "UPDATE": {
      // console.log("UPDATED");
      const state = [...prevState];
      const index = state.findIndex((item) => item._id == action.id);
      state[index] = action.job;
      state[index]._id = action.id;
      return state;
    }
    case "CLEAR": {
      // console.log("STATE CLEARED \n");
      return [];
    }
  }
};

export default loginReducer;

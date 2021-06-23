const initalState = [];

export default (prevState = initalState, action) => {
  switch (action.type) {
    case "ADD": {
      // console.log("ADDED");
      const data = action.job;
      data._id = action.id;
      return [...prevState, data];
    }
    case "DELETE": {
      // console.log("DELETED");
      return [...prevState.filter(i => i._id !== action.id)]
    }
    case "UPDATE": {
      // console.log("UPDATED");
      const state = [...prevState];
      const index = state.findIndex((item) => item._id === action.id);
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

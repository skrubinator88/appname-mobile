export const JobsReducer = (prevState = [], action) => {
  switch (action.type) {
    case "ADD": {
      console.log("JOB ADDED");
      const data = action.job;
      data._id = action.id;
      const state = [...prevState];
      state.push(data);
      return state;
    }
    case "DELETE": {
      console.log("JOB DELETED");
      const index = [...prevState].findIndex((item) => item._id == action.id);
      const state = [...prevState];
      state.splice(index, 1);
      return state;
    }
    case "UPDATE": {
      console.log("JOB UPDATED");
      const state = [...prevState];
      const index = state.findIndex((item) => item._id == action.id);
      state[index] = action.job;
      state[index]._id = action.id;
      return state;
    }
    case "CLEAR": {
      console.log("JOB STATE CLEARED \n");
      return [];
    }
    default:
      return [...prevState];
  }
};

export const QueueReducer = (prevState = [], action) => {
  switch (action.type) {
    case "ADD_JOB_QUEUE": {
      // console.log("JOB ADDED");
      const data = action.job;
      data._id = action.id;
      const state = [...prevState];
      state.push(data);
      return state;
    }
    case "DELETE_JOB_QUEUE": {
      // console.log("JOB DELETED");
      const index = [...prevState].findIndex((item) => item._id == action.id);
      const state = [...prevState];
      state.splice(index, 1);
      return state;
    }
    case "CLEAR_QUEUE": {
      // console.log("STATE CLEARED \n");
      return [];
    }
    default:
      return [...prevState];
  }
};

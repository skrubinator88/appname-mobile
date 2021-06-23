export const ListingsReducer = (prevState = [], action) => {
  switch (action.type) {
    case "ADD_LISTING": {
      const data = action.listing;
      data.id = action.id;
      data._id = action.id;
      return [...prevState, data];
    }
    case "UPDATE_LISTING": {
      const state = [...prevState];
      const index = state.findIndex((item) => item.id == action.id);
      state[index] = action.listing;
      state[index].id = action.id;
      return state;
    }
    case "DELETE_LISTING": {
      return [...prevState.filter(i => i._id !== action.id)]
    }
    case "CLEAR_LISTING": {
      // console.log("LISTINGS STATE CLEARED \n");
      return [];
    }
    default:
      return [...prevState];
  }
};

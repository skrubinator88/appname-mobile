import { createStore } from "redux";

import rootReducer from "../rdx-reducer";

const initialState = {
  jobs: [],
};

// Store
export const rootStore = createStore(rootReducer, initialState);

import { createStore } from "redux";

import rootReducer from "../rdx-reducer";

const initialState = {};

// Store
export const rootStore = createStore(rootReducer, initialState);

// Dependencies
import { combineReducers } from "redux";

// Reducers
import { JobsReducer } from "../rdx-reducer/jobs.reducer";
import { CameraReducer } from "../rdx-reducer/camera.reducer";
import { QueueReducer } from "../rdx-reducer/queue.reducer";
import { ListingsReducer } from "../rdx-reducer/listings.reducer";

// Exports
export { JobsReducer } from "../rdx-reducer/jobs.reducer";
export { CameraReducer } from "../rdx-reducer/camera.reducer";
export { QueueReducer } from "../rdx-reducer/queue.reducer";
export { ListingsReducer } from "../rdx-reducer/listings.reducer";

export default rootReducer = combineReducers({
  jobs: JobsReducer,
  camera: CameraReducer,
  queue: QueueReducer,
  listings: ListingsReducer,
});

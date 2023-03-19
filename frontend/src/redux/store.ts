import { createStore } from "redux";
import countReducer from "./count/countReducer";

const store = createStore(countReducer);

export type RootState = ReturnType<typeof store.getState>

export default store;
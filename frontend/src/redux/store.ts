import { createStore } from "redux";
import countReducer from "./count/countReducer";
import { countSlice } from "./count/slice";
import { dateSlice } from "./date/slice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    count: countSlice.reducer,
    dateRange: dateSlice.reducer
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>

export default store;
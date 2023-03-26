import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CountState {
    count: number;
}

const initialState : CountState = {
    count: 0
}

export const countSlice = createSlice({
    name: 'count',
    initialState,
    reducers: {
        addCount: (state, action: PayloadAction<number>) => {
            state.count += action.payload;
        }
    }
});
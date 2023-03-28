import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from 'dayjs'
const now = dayjs();
console.log('now', now);

export interface DateState {
    dateRange: {
        startDate: number,
        endDate: number,
    }
}

interface payloadType {
    startDate: number,
    endDate: number
}

const initialState : DateState = {
    dateRange: {
        startDate: now.startOf('month').unix(),
        endDate: now.endOf('month').unix(),
    }
}

export const dateSlice = createSlice({
    name: 'dateRange',
    initialState,
    reducers: {
        changeDate: (state, action: PayloadAction<payloadType>) => {
            state.dateRange = {
                startDate: action.payload.startDate,
                endDate: action.payload.endDate
            }
        }
    }
});
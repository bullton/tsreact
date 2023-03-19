import { ADD_COUNT, CountActionTypes } from "./countActions";

export interface CountState {
    count: number
}

const defaultState: CountState = {
    count: 0
}

export default (state = defaultState, action: CountActionTypes) => {
    switch (action.type) {
        case ADD_COUNT:
            const { count } = state;
            const newState = { ...state, count: count + action.payload }
            return newState;
        default:
            return state;
    }
};

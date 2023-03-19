export const ADD_COUNT = "add_count";

interface AddCountAction {
  type: typeof ADD_COUNT;
  payload: number;
}

export type CountActionTypes = AddCountAction;

export const addCountActionCreator = (
  step: number
): AddCountAction => {
  return {
    type: ADD_COUNT,
    payload: step,
  };
};

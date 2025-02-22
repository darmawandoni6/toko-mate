import { initialState } from '../initialState';
import { Action, InitialState } from '../types';

export const reducerGlobal = (state = initialState, action: Action): InitialState => {
  return {
    ...state,
    ...(action.payload ? { [action.type]: action.payload } : {}),
  };
};

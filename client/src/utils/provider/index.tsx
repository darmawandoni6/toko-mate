/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';

import { Context, initialState } from './initialState';
import { InitialState } from './types';

export const useGetValue = <T,>(value: (state: InitialState) => T): T => {
  const ct = useContext(Context);
  return value(ct.value);
};

// return <K extends keyof InitialState>(data: { [P in K]: InitialState[K] }) => {
//   const [type, value] = Object.entries(data)[0] as [K, InitialState[K]];
//   ct.dispatch({ type, payload: value });
// };
export const useSetValue = () => {
  const ct = useContext(Context);
  return <K extends keyof InitialState>({ type, payload }: { type: K; payload: (typeof initialState)[K] }) => {
    ct.dispatch({ type, payload });
  };
};

export const useDispatch = () => {
  const context = useContext(Context);
  return (action: any) => {
    if (typeof action === 'function') {
      // Pass dispatch as an argument if action is a function (thunk)
      return action(context.dispatch, () => context.value);
    }
    return context.dispatch;
  };
};

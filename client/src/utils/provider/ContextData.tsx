/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useMemo, useReducer } from 'react';

import { reducerProfile } from './action/profile';
import { Context, initialState } from './initialState';
import { Action, InitContext, InitialState } from './types';

function ContextData({ children }: Readonly<{ children: ReactNode }>) {
  const rootReducer = (state: InitialState, action: Action<any>) => ({
    ...reducerProfile(state, action),
  });

  const [state, dispatch] = useReducer(rootReducer, initialState);

  const value: InitContext = useMemo(
    () => ({
      value: state,
      dispatch,
    }),
    [state],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default ContextData;

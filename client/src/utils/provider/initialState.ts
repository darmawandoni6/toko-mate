import { createContext } from 'react';

import { InitContext, InitialState } from './types';

export const initialState: InitialState = {
  profile: null,
};

const ctx: InitContext = {
  value: initialState,
  setValue: (): void => {},
};

export const Context = createContext<InitContext>(ctx);

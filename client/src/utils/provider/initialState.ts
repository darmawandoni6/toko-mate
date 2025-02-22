import { createContext } from 'react';

import { InitContext, InitialState } from './types';

export const initialState: InitialState = {
  profile: {
    loading: true,
    data: null,
  },
};

const ctx: InitContext = {
  value: initialState,
  dispatch: () => {}, // Dummy function
};

export const Context = createContext<InitContext>(ctx);

import { createContext } from 'react';

import { InitialState, ModalContextType } from './types';

export const defState: InitialState = {
  isLoading: false,
  last: true,
  dataLength: 0,
};

export const ScrollContext = createContext<ModalContextType>({
  state: defState,
  next() {},
});

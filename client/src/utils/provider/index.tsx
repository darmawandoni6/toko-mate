import { useContext } from 'react';

import { Context } from './initialState';
import { InitialState } from './types';

export const useGetValue = <T,>(value: (state: InitialState) => T): T => {
  const ct = useContext(Context);
  return value(ct.value);
};

export const useSetValue = () => {
  const ct = useContext(Context);
  return (state: Partial<InitialState>) => {
    ct.setValue({ ...state });
  };
};

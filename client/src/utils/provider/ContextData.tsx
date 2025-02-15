import { ReactNode, useMemo, useState } from 'react';

import { Context, initialState } from './initialState';
import { InitContext, InitialState } from './types';

function ContextData({ children }: Readonly<{ children: ReactNode }>) {
  const [s, setS] = useState<InitialState>(initialState);

  const onValue = (state: Partial<InitialState>): void => {
    setS(prev => ({ ...prev, ...state }));
  };

  const value: InitContext = useMemo(
    () => ({
      value: s,
      setValue: onValue,
    }),
    [s],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default ContextData;

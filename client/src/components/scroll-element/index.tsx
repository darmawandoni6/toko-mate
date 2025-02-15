import { FC, PropsWithChildren, useEffect, useState } from 'react';

import clsx from 'clsx';

import ElementBody from './body';
import { ScrollContext, defState } from './context';
import { Body, InitialState, Main } from './types';

const ScrollElement: FC<PropsWithChildren<Main>> & {
  Body: FC<Body>;
} = ({ children, className, loader, next, ...props }) => {
  const [state, setState] = useState<InitialState>(defState);

  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: props.isLoading, last: props.last }));
  }, [props.isLoading, props.last]);

  useEffect(() => {
    setState(prev => ({ ...prev, dataLength: props.dataLength }));
  }, [props.dataLength]);

  const handleNext = async () => {
    if (!state.isLoading && !state.last) {
      next();
    }
  };

  return (
    <ScrollContext.Provider value={{ state, next: handleNext }}>
      <section className={clsx(className)}>{children}</section>
      {state.isLoading && loader}
    </ScrollContext.Provider>
  );
};

ScrollElement.Body = ElementBody;

export default ScrollElement;

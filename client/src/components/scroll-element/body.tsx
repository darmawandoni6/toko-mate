import { FC, memo, useContext, useRef } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { ScrollContext } from './context';
import { Body } from './types';

const ElementBody: FC<Body> = ({ className, children, index, to }) => {
  const { state, next } = useContext(ScrollContext);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = (node: HTMLElement | null) => {
    if (state.isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        next();
      }
    });

    if (node) observer.current.observe(node);
  };

  if (to)
    return (
      <Link to={to} className={clsx(className)} ref={index === state.dataLength - 1 ? lastItemRef : null}>
        {children}
      </Link>
    );

  return (
    <div className={clsx(className)} ref={index === state.dataLength - 1 ? lastItemRef : null}>
      {children}
    </div>
  );
};

export default memo(ElementBody);

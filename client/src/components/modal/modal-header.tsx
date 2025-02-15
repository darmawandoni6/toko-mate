import { FC, useCallback, useContext } from 'react';

import { ModalContext } from './context';
import { Header } from './types';

const ModalHeader: FC<Header> = ({ title }) => {
  const context = useContext(ModalContext);

  const handleClick = useCallback(() => {
    context.onHide();
  }, [context]);

  return (
    <div className="border-b p-3 relative">
      {title && <h1 className="text-xl font-bold">{title}</h1>}
      <button className="h-8 aspect-square text-lg absolute top-1 right-1" onClick={handleClick}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
};

export default ModalHeader;

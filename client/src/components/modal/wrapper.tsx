import { FC, useCallback } from 'react';

import { ModalContext } from './context';
import { Modal } from './types';

const Wrapper: FC<Modal> = ({ setShow, children }) => {
  const onHide = useCallback(
    (show?: boolean) => {
      if (setShow) {
        setShow(show);
      }
    },
    [setShow],
  );

  return (
    <ModalContext.Provider value={{ onHide }}>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => {
          if (setShow) {
            setShow(false);
          }
        }}
      >
        <div className="bg-white rounded-md shadow-lg w-[480px] max-w-[90%]" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

export default Wrapper;

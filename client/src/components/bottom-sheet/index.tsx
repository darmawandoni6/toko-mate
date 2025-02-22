import { FC, ReactNode } from 'react';

import { createPortal } from 'react-dom';

interface Props {
  show: boolean;
  setShow?: () => void;
  children: ReactNode;
}
const BottomSheet: FC<Props> = ({ show, setShow, children }) => {
  return createPortal(
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50" onClick={setShow}>
        <div className="bg-white rounded-t-md shadow-lg w-[480px] max-w-full p-2" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    ),
    document.body,
  );
};

export default BottomSheet;

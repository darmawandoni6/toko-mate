import { FC, PropsWithChildren } from 'react';

import clsx from 'clsx';
import { createPortal } from 'react-dom';

import ModalHeader from './modal-header';
import { Body, Footer, Header, Modal as Props } from './types';
import Wrapper from './wrapper';

const Modal: FC<PropsWithChildren<Props>> & {
  Header: FC<Header>;
  Body: FC<Body>;
  Footer: FC<Footer>;
} = ({ show, setShow, children }) => {
  return createPortal(
    show && (
      <Wrapper show={show} setShow={setShow}>
        {children}
      </Wrapper>
    ),
    document.body,
  );
};

Modal.Header = ModalHeader;

Modal.Body = ({ children, className, style }) => {
  return (
    <div className={clsx('p-4 text-sm', className)} style={style}>
      {children}
    </div>
  );
};

Modal.Footer = ({ children, className, style }) => {
  return (
    <div className={clsx('border-t p-3 text-sm', className)} style={style}>
      {children}
    </div>
  );
};

export default Modal;

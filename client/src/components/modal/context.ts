import { createContext } from 'react';

interface ModalContextType {
  onHide: (show?: boolean) => void;
}

export const ModalContext = createContext<ModalContextType>({
  onHide() {},
});

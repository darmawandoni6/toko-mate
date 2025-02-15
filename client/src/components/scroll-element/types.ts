import { ReactElement, ReactNode } from 'react';

export interface Main {
  className?: string;
  children: ReactNode;
  loader: ReactElement;
  isLoading: boolean;
  last: boolean;
  dataLength: number;
  next: () => void;
}

export interface Body {
  children: ReactNode;
  className?: string;
  to?: string;
  index: number;
}

export interface InitialState {
  isLoading: boolean;
  last: boolean;
  dataLength: number;
}

export interface ModalContextType {
  state: InitialState;
  next: () => void;
}

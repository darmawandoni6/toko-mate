import { CSSProperties, ReactElement, ReactNode } from 'react';

export interface Header {
  title: string;
  children?: ReactElement;
}
export interface Body {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export interface Footer {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export interface Modal {
  show: boolean;
  setShow?: (show?: boolean) => void;
  children: ReactNode;
}

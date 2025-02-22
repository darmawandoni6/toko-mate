/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'react';

import { ProfileAPI } from '../../repository/auth/types';

export type PromiseFunction<T = unknown> = (...args: unknown[]) => Promise<T>;
export type Action<T = string, P = any> = { type: T; payload?: P };

export interface InitContext {
  value: InitialState;
  dispatch: Dispatch<Action>;
}

export interface InitialState {
  profile: {
    loading: boolean;
    data: ProfileAPI | null;
  };
}

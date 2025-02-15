import { ProfileAPI } from '../../repository/auth/types';

export type PromiseFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

export interface InitContext {
  value: InitialState;
  setValue: (state: Partial<InitialState>) => void;
}

export interface InitialState {
  profile: ProfileAPI | null;
}

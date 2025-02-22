import { ProfileAPI } from '../../../repository/auth/types';
import { initialState } from '../initialState';
import { Action, InitialState } from '../types';

export enum Profile {
  loading = 'profile_loading',
  success = 'profile_success',
  error = 'profile_error',
}
export const reducerProfile = (state = initialState, action: Action<Profile, ProfileAPI | null>): InitialState => {
  switch (action.type) {
    case Profile.loading:
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: true,
        },
      };
    case Profile.success:
    case Profile.error:
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: false,
          data: action.payload ?? null,
        },
      };

    default:
      return state;
  }
};

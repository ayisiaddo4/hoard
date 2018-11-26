import { INIT_USER, UPDATE_USER, CLEAR_USER } from './constants';

export function initUser(user) {
  return { type: INIT_USER, user: user };
};

export function updateUser(user) {
  return { type: UPDATE_USER, user: user };
};

export function clearUser() {
  return { type: CLEAR_USER };
};

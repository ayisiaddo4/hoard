import { SHOW_RECEIVE_MODAL, HIDE_RECEIVE_MODAL } from './constants.js';

const initialState = {
  selectedWalletId: null,
  show: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_RECEIVE_MODAL:
      return {
        ...state,
        selectedWalletId: action.selectedWalletId,
        show: true,
      };
    case HIDE_RECEIVE_MODAL:
      return {
        ...state,
        selectedWalletId: null,
        show: false,
      };
    default:
      return state;
  }
}

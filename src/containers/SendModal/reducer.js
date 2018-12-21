import { SHOW_SEND_MODAL, HIDE_SEND_MODAL } from './constants.js';

const initialState = {
  selectedWalletId: null,
  show: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_SEND_MODAL:
      return {
        ...state,
        selectedWalletId: action.selectedWalletId,
        show: true,
      };
    case HIDE_SEND_MODAL:
      return {
        ...state,
        selectedWalletId: null,
        show: false,
      };
    default:
      return state;
  }
}

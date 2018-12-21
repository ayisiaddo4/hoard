import { SHOW_RECEIVE_MODAL, HIDE_RECEIVE_MODAL } from './constants';

export function showReceiveModal(id) {
  const selectedWalletId = typeof id === 'string' ? id : null;
  return { type: SHOW_RECEIVE_MODAL, selectedWalletId };
}

export function hideReceiveModal() {
  return { type: HIDE_RECEIVE_MODAL };
}

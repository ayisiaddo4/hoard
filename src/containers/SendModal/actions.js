import { SHOW_SEND_MODAL, HIDE_SEND_MODAL } from './constants';

export function showSendModal(id) {
  const selectedWalletId = typeof id === 'string' ? id : null;
  return { type: SHOW_SEND_MODAL, selectedWalletId };
}

export function hideSendModal() {
  return { type: HIDE_SEND_MODAL };
}

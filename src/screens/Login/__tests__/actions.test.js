/* eslint no-undef: 0 */
import loginRequest from '../actions';
import { LOGIN_REQUESTING } from '../constants';

describe('Login Actions', () => {
  it('has a type of LOGIN_REQUESTING', () => {
    const expected = {
      type: LOGIN_REQUESTING,
      email_address: 'test email address',
      password: 'test password',
    };
    expect(
      loginRequest({
        email_address: 'test email address',
        password: 'test password',
      })
    ).toEqual(expected);
  });
});

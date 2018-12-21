/* eslint no-undef: 0 */

import signupRequest from '../actions';
import { SIGNUP_REQUESTING } from '../constants';

describe('Signup Actions', () => {
  it('has a type of SIGNUP_REQUESTING', () => {
    const expected = {
      type: SIGNUP_REQUESTING,
      first_name: 'Test',
      last_name: 'Tester',
      phone_number: 1,
      email_address: 'test email address',
      password: 'test password',
    };
    expect(
      signupRequest({
        first_name: 'Test',
        last_name: 'Tester',
        phone_number: 1,
        email_address: 'test email address',
        password: 'test password',
      })
    ).toEqual(expected);
  });
});

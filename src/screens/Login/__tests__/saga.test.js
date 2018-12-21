import { LOGIN_SUCCESS } from 'screens/Login/constants';
import loginFlow, { loginApi } from 'screens/Login/sagas';

const foundUser = 'someuser';

const runTillDone = saga => {
  const values = [];
  let isYieldingForUser = false;
  while (true) {
    // eslint-disable-line no-constant-condition
    let result;

    if (isYieldingForUser) {
      result = saga.next(foundUser);
    } else {
      result = saga.next();
    }

    isYieldingForUser =
      result.value && result.value.CALL && result.value.CALL.fn === loginApi;

    if (!result.done) {
      values.push(result.value);
    } else {
      values.push(result.value);
      break;
    }
  }
  return values;
};

describe('Login Saga', () => {
  const loginArg = { email_address: 'a', password: 'b' };
  const values = runTillDone(loginFlow(loginArg));

  it('should hit the api to log in with provided email and password', () => {
    const apiCall = values.find(
      value =>
        value.CALL &&
        value.CALL.fn === loginApi &&
        value.CALL.args[0] === loginArg.email_address &&
        value.CALL.args[1] === loginArg.password
    );
    expect(apiCall).toBeTruthy();
  });

  it('should dispatch a success event', () => {
    const success = values.find(
      value => value.PUT && value.PUT.action.type === LOGIN_SUCCESS
    );
    expect(success).toBeTruthy();
  });

  it('should return the found user', () => {
    expect(values[values.length - 1]).toBe(foundUser);
  });
});

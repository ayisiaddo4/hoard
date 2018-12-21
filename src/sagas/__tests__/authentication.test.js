import { LOGIN_REQUESTING } from 'screens/Login/constants';
import { SIGNUP_REQUESTING } from 'screens/Signup/constants';
import signupFlow from 'screens/Signup/sagas';
import loginFlow from 'screens/Login/sagas';
import authenticationWatcher, {
  getUser,
  setUser,
  logoutFlow,
  logoutApi,
  AUTH_SIGNOUT,
} from '../authentication';
import NavigatorService from 'lib/navigator';

const DashboardRedirectTest = (watcher, nextArg) => {
  const dispatch = jest.fn();
  NavigatorService.setContainer({ dispatch });

  expect(dispatch).not.toHaveBeenCalled();
  const result = watcher.next(nextArg);

  expect(dispatch).toHaveBeenCalledWith({
    type: 'Navigation/NAVIGATE',
    routeName: 'Dashboard',
  });

  return result;
};

describe('Authentication Saga', () => {
  let waitForSignout;

  const LogOutFlow = watcher => () => {
    it('will wait for subsequent signout calls', () => {
      expect(waitForSignout.value.TAKE.pattern).toEqual([AUTH_SIGNOUT]);
    });

    it('when a signout is called, it will then log the user out', () => {
      expect(watcher.next().value.CALL.fn).toBe(logoutFlow);
    });

    it('will redirect to login and restart the flow when logout is completed', () => {
      NavigatorService.setContainer({
        dispatch: action =>
          expect(action).toEqual({
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
          }),
      });

      expect(watcher.next().value.CALL.fn).toBe(getUser);
    });
  };

  describe('Previously signed in user', () => {
    const storedWatcher = authenticationWatcher();

    it('will first attempt to fetch an existing user', () => {
      expect(storedWatcher.next().value.CALL.fn).toBe(getUser);
    });

    it('will redirect to the dashboard on load', () => {
      waitForSignout = DashboardRedirectTest(storedWatcher, {}); // feed user in
    });

    describe(
      'will forward on to the signout process',
      LogOutFlow(storedWatcher)
    );
  });

  describe('New user', () => {
    const signupWatcher = authenticationWatcher();

    it('will first attempt to fetch an existing user', () => {
      expect(signupWatcher.next().value.CALL.fn).toBe(getUser);
    });

    it('will then wait for login and signup to start', () => {
      expect(signupWatcher.next().value.TAKE.pattern).toEqual([
        LOGIN_REQUESTING,
        SIGNUP_REQUESTING,
      ]);
    });

    it('will then call the signup flow', () => {
      const fn = signupWatcher.next({ type: SIGNUP_REQUESTING }).value.CALL.fn;
      expect(fn).toBe(signupFlow);
      expect(fn).not.toBe(loginFlow);
    });

    it('will then set the user that is created', () => {
      const user = 'HEY GUYS! I signed up!';
      const call = signupWatcher.next(user).value.CALL;
      expect(call.fn).toBe(setUser);
      expect(call.args).toEqual([user]);
    });

    it('will redirect to the dashboard when that is set to the device', () => {
      waitForSignout = DashboardRedirectTest(signupWatcher);
    });

    describe(
      'will forward on to the signout process',
      LogOutFlow(signupWatcher)
    );
  });

  describe('Logged out user', () => {
    const loginWatcher = authenticationWatcher();

    it('will first attempt to fetch an existing user', () => {
      expect(loginWatcher.next().value.CALL.fn).toBe(getUser);
    });

    it('will then wait for login and signup to start', () => {
      expect(loginWatcher.next().value.TAKE.pattern).toEqual([
        LOGIN_REQUESTING,
        SIGNUP_REQUESTING,
      ]);
    });

    it('will then call the signup flow', () => {
      const fn = loginWatcher.next({ type: LOGIN_REQUESTING }).value.CALL.fn;
      expect(fn).toBe(loginFlow);
      expect(fn).not.toBe(signupFlow);
    });

    it('will then set the user that is created', () => {
      const user = 'HEY GUYS! I logged in!';
      const call = loginWatcher.next(user).value.CALL;
      expect(call.fn).toBe(setUser);
      expect(call.args).toEqual([user]);
    });

    it('will redirect to the dashboard when that is set to the device', () => {
      waitForSignout = DashboardRedirectTest(loginWatcher);
    });

    describe(
      'will forward on to the signout process',
      LogOutFlow(loginWatcher)
    );
  });

  describe('Error while creating user', () => {
    const errorWatcher = authenticationWatcher();

    it('will first attempt to fetch an existing user', () => {
      expect(errorWatcher.next().value.CALL.fn).toBe(getUser);
    });

    it('will then wait for login and signup to start', () => {
      expect(errorWatcher.next().value.TAKE.pattern).toEqual([
        LOGIN_REQUESTING,
        SIGNUP_REQUESTING,
      ]);
    });

    it('will then call the signup flow', () => {
      expect(errorWatcher.next({ type: LOGIN_REQUESTING }).value.CALL.fn).toBe(
        loginFlow
      );
    });

    it('will restart the flow when no user is created', () => {
      expect(errorWatcher.next().value.CALL.fn).toBe(getUser);
    });
  });

  describe('No Redirect desired', () => {
    const noRedirectWatcher = authenticationWatcher();

    it('will not redirect when the login/signup action has a noRedirect flag on it', () => {
      const noRedirectAction = { type: LOGIN_REQUESTING, noRedirect: true };

      // run through the flow
      expect(noRedirectWatcher.next().value.CALL.fn).toBe(getUser);
      expect(noRedirectWatcher.next().value.TAKE.pattern).toEqual([
        LOGIN_REQUESTING,
        SIGNUP_REQUESTING,
      ]);
      expect(noRedirectWatcher.next(noRedirectAction).value.CALL.fn).toBe(
        loginFlow
      );
      expect(noRedirectWatcher.next('HEY').value.CALL.fn).toBe(setUser);

      const dispatch = jest.fn();
      NavigatorService.setContainer({ dispatch });
      expect(dispatch).not.toHaveBeenCalled();
      waitForSignout = noRedirectWatcher.next();
      expect(dispatch).not.toHaveBeenCalled();
    });

    describe(
      'will forward on to the signout process',
      LogOutFlow(noRedirectWatcher)
    );
  });
});

const runTillDone = saga => {
  const values = [];
  while (true) {
    // eslint-disable-line no-constant-condition
    const result = saga.next();
    if (!result.done) {
      values.push(result.value);
    } else {
      break;
    }
  }
  return values;
};

describe('logout saga', () => {
  const sagaActions = runTillDone(logoutFlow());
  it('should logout the user via api', () => {
    expect(
      sagaActions.find(a => a && a.CALL && a.CALL.fn === logoutApi)
    ).toBeTruthy();
  });

  it("should remove the user's token from local storage", () => {
    const setUserCall = sagaActions.find(
      a => a && a.CALL && a.CALL.fn === setUser
    );
    expect(setUserCall).toBeTruthy();
    expect(setUserCall.CALL.args).toEqual(['']);
  });
});

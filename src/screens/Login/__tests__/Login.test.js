import React from 'react';
import Login from '../Login';
import renderer from 'react-test-renderer';

function snapshotForm(props) {
  const tree = renderer.create(<Login {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
}

describe('Login view', () => {
  it('should render correctly', () => {
    let props = {
      navigator: {},
      login: { errors: [] },
      loginRequest: () => {},
    };
    snapshotForm(props);
  });
});

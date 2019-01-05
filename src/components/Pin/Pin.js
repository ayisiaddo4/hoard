import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PinScreen from 'components/Pin/PinScreen';
import { getKey } from './utils';

const LANG_ENTER_STRING = 'Please enter your PIN.';
const LANG_SUCCESS_STRING = 'Your PIN was entered successfully!.';

export default class Pin extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    handleSuccess: PropTypes.func,
  };

  static defaultProps = {
    title: LANG_ENTER_STRING,
  };

  state = {
    pin: null,
    succeeded: false,
    failed: false,
  };

  componentDidMount = async () => {
    const pin = await getKey();
    this.setState({ pin });
  };

  handleSuccess = () =>
    this.setState({ succeeded: true }, this.props.handleSuccess);

  handleFailure = () => this.setState({ failed: true });

  render() {
    const { title, subtitle } = this.props;
    const { succeeded, failed, pin } = this.state;

    return (
      <PinScreen
        title={succeeded ? LANG_SUCCESS_STRING : title}
        subtitle={failed ? 'Too Many Attempts' : subtitle}
        expectedPin={pin}
        showKeyboard={!succeeded && !failed}
        onSuccess={this.handleSuccess}
        onFailure={this.handleFailure}
        maxAttempts={5}
      />
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PinScreen from 'components/Pin/PinScreen';
import NavigatorService from 'lib/navigator';

import { getKey, saveKey } from 'components/Pin/utils';
import { t } from 'translations/i18n';

export default class UpdatePin extends Component {
  static propTypes = {
    pinLength: PropTypes.number,
    notificationRecieved: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pinLength: 6,
  };

  state = {
    pin: '',
    confirmedPin: false,
    newPin: '',
    confirmNewPin: '',
  };

  componentDidMount = async () => {
    const pin = await getKey();
    this.setState({ pin });
  };

  handleConfirmPin = () => this.setState({ confirmedPin: true });

  handleSetNewPin = newPin => this.setState({ newPin });

  handleConfirmNewPin = async confirmNewPin => {
    this.setState({ confirmNewPin });

    await saveKey(confirmNewPin);

    this.props.notificationRecieved({
      type: 'success',
      title: t('update_pin.success_title'),
      content: t('update_pin.success_subtitle'),
    });
    NavigatorService.navigate('Settings');
  };

  render() {
    const { pinLength } = this.props;

    const { pin, confirmedPin, newPin, confirmNewPin } = this.state;

    let expectedPin, onSuccess, title, subtitle; // eslint-disable-line immutable/no-let

    if (!confirmedPin) {
      title = t('update_pin.current_pin_title');
      subtitle = t('update_pin.current_pin_subtitle');
      onSuccess = this.handleConfirmPin;
      expectedPin = pin;
    } else if (!newPin) {
      title = t('update_pin.new_pin_title');
      subtitle = t('update_pin.new_pin_subtitle');
      onSuccess = this.handleSetNewPin;
      expectedPin = null;
    } else {
      title = t('update_pin.confirm_pin_title');
      subtitle = t('update_pin.confirm_pin_subtitle');
      onSuccess = this.handleConfirmNewPin;
      expectedPin = newPin;
    }

    return (
      <PinScreen
        showKeyboard={!confirmNewPin}
        subtitle={subtitle}
        title={title}
        onSuccess={onSuccess}
        expectedPin={expectedPin}
        pinLength={pinLength}
      />
    );
  }
}

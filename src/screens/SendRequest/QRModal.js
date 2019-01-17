import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import NavigatorService from 'lib/navigator';
import Scanner from 'components/Camera/Scanner';
import { Header } from 'components/Base/Navigation';
import { t } from 'translations/i18n';

import {
  TYPE_SEND,
  TYPE_REQUEST,
  RECIPIENT_TYPE_ADDRESS,
  RECIPIENT_TYPE_OTHER,
} from 'screens/SendRequest/constants';
import { colors } from 'styles';

export default class QRModal extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          onChangeRecipient: PropTypes.func.isRequired,
          transactionType: PropTypes.oneOf([TYPE_REQUEST, TYPE_SEND]),
        }),
      }),
    }),
  };

  handleRead = value => {
    const {
      transactionType,
      onChangeRecipient,
    } = this.props.navigation.state.params;

    const recipientType =
      transactionType === TYPE_SEND
        ? RECIPIENT_TYPE_ADDRESS
        : RECIPIENT_TYPE_OTHER;

    const recipient =
      transactionType === TYPE_SEND
        ? value.replace(/(\w+:)? ?(\w+)(([\?\&]\w+=\w+)+)?/, '$2')
        : value;

    onChangeRecipient({
      recipientType,
      recipient,
    });

    NavigatorService.navigate('SendRequest');
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          leftAction={'cancel'}
          title={t('send_request.scan_qr')}
          rightAction={null}
        />
        <View style={styles.cameraContainer}>
          <Scanner
            onRead={this.handleRead}
            isShowScanBar={false}
            cornerColor={'rgba(230, 34, 141, 0.5)'}
            borderColor={colors.pinkDark}
            borderWidth={1}
            cornerBorderWidth={2}
            cornerBorderLength={20}
            cornerOffsetSize={8}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    marginTop: 20,
    flex: 1,
  },
});

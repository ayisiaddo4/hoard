import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import NavigatorService from 'lib/navigator';
import Scanner from 'components/Camera/Scanner';
import { Header } from 'components/Base/Navigation';
import { t } from 'translations/i18n';

import { RECIPIENT_TYPE_ADDRESS } from 'screens/SendRequest/constants';
import { colors } from 'styles';

export default class QRModal extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          onChangeRecipient: PropTypes.func.isRequired
        }),
      }),
    }),
  };

  handleRead = (value) => {
    this.props.navigation.state.params.onChangeRecipient({
      recipientType: RECIPIENT_TYPE_ADDRESS,
      recipient: value.replace(/(\w+:)?(\w+)([\?\&]\w+=\w+)+/, '$2')
    });
    NavigatorService.navigate('SendRequest');
  }

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

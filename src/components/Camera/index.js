import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import T from 'components/Typography';
import Button from 'components/Button';
import Input from 'components/Input';
import { Layout, Body, Header } from 'components/Base';

import { colors } from 'styles';
import Scanner from './Scanner';

export default class Camera extends Component {
  state = {
    result: {},
    address: '',
  };

  handleOnRead = result => {
    this.setState({ result, address: result.data });
  };

  updateFormField = fieldName => text => {
    this.setState({ [fieldName]: text });
  };

  handleFormSubmit = () => {
    this.props.onRead(this.state.address);
  };
  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    return (
      <Layout keyboard>
        <Header style={styles.top}>
          <Scanner
            onRead={this.handleOnRead}
            isShowScanBar={false}
            cornerColor={'rgba(230, 34, 141, 0.5)'}
            borderColor={colors.pinkDark}
            borderWidth={1}
            cornerBorderWidth={2}
            cornerBorderLength={20}
            cornerOffsetSize={8}
          />
        </Header>
        <Body scrollable style={styles.body}>
          <View style={styles.bottom}>
            <T.Heading style={styles.text}>
              Scan QR or manually enter address.
            </T.Heading>
            <Input
              ref={el => (this.address = el)}
              placeholder="Address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              keyboardType="default"
              editable={true}
              onSubmitEditing={this.handleFormSubmit}
              onChangeText={this.updateFormField('address')}
              value={this.state.address}
              type="underline"
            />
            <Button
              type="base"
              disabled={!this.state.address}
              loading={this.state.loading}
              onPress={this.handleFormSubmit}
              style={styles.buttonContainerAlt}
            >
              Next
            </Button>
            <Button type="text" onPress={this.handleCancel}>
              Cancel
            </Button>
          </View>
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  top: {
    flex: 1,
  },
  bottom: {
    flex: 1,
  },
  text: {
    color: 'white',
    padding: 20,
  },
  buttonContainerAlt: {
    marginVertical: 30,
  },
});

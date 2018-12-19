import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native-animatable';
import Icon from 'components/Icon';
import { Layout, Body } from 'components/Base';

export default class Scene extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    duration: PropTypes.number,
  };

  static defaultProps = {
    duration: 750,
  };

  renderLoader() {
    return (
      <View
        animation="rotate"
        duration={750}
        easing="ease-in-out-circ"
        iterationCount="infinite"
        style={{
          height: 40,
          width: 40,
          alignItems: 'center',
        }}
      >
        <Icon icon="ios-ionic" style={{ position: 'absolute' }} />
      </View>
    );
  }

  render() {
    return (
      <Layout style={{ flex: 1 }}>
        <Body>{this.props.children}</Body>
      </Layout>
    );
  }
}

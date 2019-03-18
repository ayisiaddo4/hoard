import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import NavigationActions from 'lib/navigator';
import { calculateHitSlop } from 'styles';

import { getScaledImageWidth } from 'lib/image-helpers';

const hitSlop = calculateHitSlop(20);
const BACK_ICON_LIGHT = require('assets/back-light.png');
const BACK_ICON_DARK = require('assets/back-dark.png');
const CLOSE_ICON_LIGHT = require('assets/cancel-light.png');
const CLOSE_ICON_DARK = require('assets/cancel-dark.png');

const goBack = () => NavigationActions.back();

export default function LeftActionComponent({ type, style }) {
  if (!type || type === false) {
    return null;
  }

  if (type === 'back' || type === 'cancel' || typeof type === 'function') {
    const onPress = typeof type === 'function' ? type : goBack;
    const icon =
      type === 'back' || typeof type === 'function'
        ? BACK_ICON_LIGHT
        : CLOSE_ICON_LIGHT;

    const imageStyle =
      icon === BACK_ICON_LIGHT ? styles.backIconStyles : styles.closeIconStyles;

    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress} hitSlop={hitSlop}>
          <Image source={icon} style={[styles.icon, imageStyle]} />
        </TouchableOpacity>
      </View>
    );
  } else if (typeof type === 'object') {
    return <View style={style}>{type}</View>;
  }
}

// eslint-disable-next-line immutable/no-mutation
LeftActionComponent.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.oneOf(['back', 'cancel', false, null]),
    PropTypes.function,
    PropTypes.node,
  ]),
  style: ViewPropTypes.style,
};

// eslint-disable-next-line immutable/no-mutation
LeftActionComponent.defaultProps = {
  type: 'back'
};

const styles = StyleSheet.create({
  icon: {
    height: 15,
    resizeMode: 'contain',
  },
  backIconStyles: {
    width: getScaledImageWidth(15, BACK_ICON_LIGHT),
  },
  closeIconStyles: {
    width: getScaledImageWidth(15, CLOSE_ICON_LIGHT),
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import NavigationActions from 'lib/navigator';
import { calculateHitSlop } from 'styles';

import { getScaledImageWidth } from 'lib/image-helpers';

const hitSlop = calculateHitSlop(20);
const MENU_ICON_LIGHT = require('assets/sidebar-light.png');
const MENU_ICON_DARK = require('assets/sidebar-dark.png');

const openMenu = () => NavigationActions.openDrawer();

export default function RightActionComponent({ type = 'menu' }) {
  if (!type || type === false) {
    return null;
  }

  if (type === 'menu') {
    return (
      <TouchableOpacity onPress={openMenu} hitSlop={hitSlop}>
        <Image
          source={MENU_ICON_LIGHT}
          resizeMode="contain"
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  } else if (typeof type === 'object') {
    return type;
  }
}

// eslint-disable-next-line immutable/no-mutation
RightActionComponent.propTypes = {
  type: PropTypes.oneOfType([PropTypes.oneOf(['menu']), PropTypes.node]),
};

const styles = StyleSheet.create({
  icon: {
    height: 15,
    width: getScaledImageWidth(15, MENU_ICON_LIGHT),
    resizeMode: 'contain',
  },
});

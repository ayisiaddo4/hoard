import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import T from 'components/Typography';
import NavigationActions from 'lib/navigator';
import createStyles, {
  padding,
  colors,
  typography,
  calculateHitSlop,
} from 'styles';
import { SafeAreaView } from 'react-navigation';

const hitSlop = calculateHitSlop(20);
const BACK_ICON = require('assets/bck.png');
const CLOSE_ICON = require('assets/closeicon.png');
const MENU_ICON = require('assets/sidebar.png');

const goBack = () => NavigationActions.back();
const openMenu = () => NavigationActions.openDrawer();

function getNavProps(navProps, key) {
  return (
    (navProps.navigation.state.params &&
      navProps.navigation.state.params[key]) ||
    navProps.navigationOptions[key] ||
    navProps[key]
  );
}

export function LeftActionComponent({ type = 'back' }) {
  if (!type || type === false) {
    return null;
  }

  if (type === 'back' || type === 'cancel' || typeof type === 'function') {
    const onPress = typeof type === 'function' ? type : goBack;
    const icon =
      type === 'back' || typeof type === 'function' ? BACK_ICON : CLOSE_ICON;
    return (
      <View style={styles.leftActionContainer}>
        <TouchableOpacity onPress={onPress} hitSlop={hitSlop}>
          <Image source={icon} />
        </TouchableOpacity>
      </View>
    );
  } else if (typeof type === 'object') {
    return <View style={styles.leftActionContainer}>{type}</View>;
  }
}

export function RightActionComponent({ type = 'menu' }) {
  if (!type || type === false) {
    return null;
  }

  if (type === 'menu') {
    return (
      <TouchableOpacity onPress={openMenu} hitSlop={hitSlop}>
        <Image source={MENU_ICON} />
      </TouchableOpacity>
    );
  } else if (typeof type === 'object') {
    return type;
  }
}

export const Header = props => {
  const headerStyle = props.leftAction
    ? styles.titleLight
    : [createStyles().header, styles.titleBold];

  return (
    <SafeAreaView forceInset={{ top: 'always' }}>
      <View style={styles.container}>
        <LeftActionComponent type={props.leftAction} />
        <View style={styles.headerContainer}>
          <T.Heading style={headerStyle}>{props.title}</T.Heading>
        </View>
        {props.multipage && (
          <View style={styles.pagerContainer}>
            <T.Light style={styles.pager}>
              {props.currentPage}/{props.totalPages}
            </T.Light>
          </View>
        )}
        <View style={styles.rightActionContainer}>
          <RightActionComponent type={props.rightAction} />
        </View>
      </View>
    </SafeAreaView>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  leftAction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
    PropTypes.bool,
  ]),
  rightAction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.obol,
  ]),
  multipage: PropTypes.bool,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  style: ViewPropTypes.style,
};

/*

USAGE:

static navigationOptions =  {
  title: 'My Title',
};

componentDidMount() {
  // this.props.navigation.setParams({ leftAction: 'close', title: 'My Title' });
}
*/

export const getNavigationOptions = navProps => {
  // TODO check if navigation.state.routes.length > 1 to allow for back actions
  const leftAction = getNavProps(navProps, 'leftAction');
  const rightAction = getNavProps(navProps, 'rightAction');
  const title = getNavProps(navProps, 'title') || null;
  const multipage = getNavProps(navProps, 'multipage');
  const currentPage = getNavProps(navProps, 'currentPage');
  const totalPages = getNavProps(navProps, 'totalPages');

  return {
    header: props => {
      return (
        <Header
          leftAction={leftAction}
          rightAction={rightAction}
          title={title}
          multipage={multipage}
          currentPage={currentPage}
          totalPages={totalPages}
          {...props}
        />
      );
    },
    headerStyle: {
      backgroundColor: 'transparent',
    },
  };
};

export const transitionConfig = () => {
  return {
    containerStyle: {},
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;

      const thisSceneIndex = scene.index;
      const width = layout.initWidth;

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      });

      const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [0, 1],
      });

      return { opacity: opacity, transform: [{ translateX: translateX }] };
    },
  };
};

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: padding.md,
    paddingTop: 10,
  },
  headerContainer: {},
  titleBold: {
    color: colors.white,
  },
  titleLight: {
    color: colors.grayLight,
    fontSize: typography.size.md,
    fontWeight: typography.weight.normal,
  },
  pagerContainer: {
    marginLeft: 5,
  },
  pager: {
    color: colors.grayLight,
    fontSize: typography.size.md,
    fontWeight: typography.weight.normal,
  },
  rightActionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  rightActionText: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.normal,
  },
  leftActionContainer: {
    flex: 1,
  },
});

import React from 'react';
import { Animated, Easing } from 'react-native';
import MenuHeader from './MenuHeader';

import { colors } from 'styles';

function getNavProps(navProps, key) {
  return (
    (navProps.navigation.state.params &&
      navProps.navigation.state.params[key]) ||
    navProps.navigationOptions[key] ||
    navProps[key]
  );
}

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
  const showShadow = getNavProps(navProps, 'showShadow');
  const showTitleOnScroll = getNavProps(navProps, 'showTitleOnScroll');

  return {
    header: props => {
      return (
        <MenuHeader
          leftAction={leftAction}
          rightAction={rightAction}
          title={title}
          multipage={multipage}
          currentPage={currentPage}
          totalPages={totalPages}
          showShadow={showShadow}
          showTitleOnScroll={showTitleOnScroll}
          {...props}
        />
      );
    },
    headerStyle: {},
  };
};

export const transitionConfig = () => {
  return {
    containerStyle: {
      backgroundColor: colors.background,
    },
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
  };
};

export const updateHeaderFromScroll = (event, navigation) => {
  const yOffset = event.nativeEvent.contentOffset.y;
  const showShadow = yOffset > 0;

  if (navigation.getParam('showShadow') !== showShadow) {
    navigation.setParams({
      showShadow,
    });
  }
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  SafeAreaView,
  View,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';

import LeftActionComponent from './LeftActionComponent';
import RightActionComponent from './RightActionComponent';
import T from 'components/Typography';

import createStyles, { colors, typography, padding } from 'styles';

export class Header extends Component {
  static propTypes = {
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
    showShadow: PropTypes.bool,
    showTitleOnScroll: PropTypes.bool,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    style: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
  };

  state = {
    animatedOpacity: new Animated.Value(0),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.showShadow !== nextProps.showShadow) {
      Animated.timing(this.state.animatedOpacity, {
        duration: 250,
        // Components which are wrapped by the HOC can decide what
        // animation to implement based on the animateValue
        // between 0 and 1.
        toValue: nextProps.showShadow ? 0.5 : 0,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const props = this.props;
    const headerStyle =
      props.leftAction !== null && props.leftAction !== false
        ? styles.titleLight
        : [createStyles().header, styles.titleBold];

    let title; // eslint-disable-line immutable/no-let
    if (props.showTitleOnScroll) {
      if (props.showShadow) {
        title = props.title;
      }
    } else {
      title = props.title;
    }

    return (
      <Animated.View
        style={[
          styles.bottomShadow,
          {
            shadowOpacity: this.state.animatedOpacity,
          },
        ]}
      >
        <SafeAreaView
          style={[styles.safeArea, props.containerStyle]}
          forceInset={{ top: 'always', bottom: 'never' }}
        >
          <View style={styles.container}>
            <LeftActionComponent
              type={props.leftAction}
              style={styles.leftActionContainer}
            />
            <View style={styles.headerContainer}>
              <T.Heading style={headerStyle}>{title}</T.Heading>
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
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    overflow: 'visible',
  },
  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.md,
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
  leftActionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  bottomShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 15,
    elevation: 1,
  },
});

export default Header;

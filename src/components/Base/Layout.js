/**
 * Layout.js
 *
 * Description:
 * Components that provide consistent layout behavior for screens, views, and
 * sections of content throughout the application. Based on flexbox.
 *
 *
 * Usage:
 * <Layout/> fills screen, flexes children, no scrolling, controls loading view
 * <Body/> nestable view, scrolls content
 * <[Header|Body|Footer]> generic content views with special styling/layout
 *
 * Example - fixed header and footer, only body is scrollable:
 * <Layout>
 *   <Header> - Fixed to top
 *   <Body scrollable bounces={false}> -- scrollable body
 *     <Header />  -- scrolls in parent
 *     <Body /> --
 *     <Footer />
 *   <Body>
 *   <Footer> - Fixed to Bottom
 * </Layout>
 *
 *
 * Example - all content is scrollable:
 * <Layout>
 *   <Body scrollable bounces={true}>
 *     <Header>
 *       <Body>
 *         <Header />
 *         <Body />
 *         <Footer />
 *       <Body>
 *     <Footer>
 *   </Body>
 * </Layout>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View as AnimatedView } from 'react-native-animatable';
import invoke from 'lodash/invoke';
import has from 'lodash/has';
import Icon from 'components/Icon';
import { Try } from 'components/Conditional';
import KeyboardShift from './KeyboardShift';

import {
  Animated,
  InteractionManager,
  StyleSheet,
  View,
  ViewPropTypes,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from 'react-native';

class Layout extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    delay: PropTypes.number,
    duration: PropTypes.number,
    preload: PropTypes.bool,
    contentReady: PropTypes.bool,
    withHeader: PropTypes.bool,
    keyboard: PropTypes.bool,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    delay: 0,
    duration: 750,
    preload: false,
    contentReady: true,
    withHeader: true,
    keyboard: false,
  };

  state = {
    isReady: false,
    hasFaded: false,
  };

  spinnerAnimationValue = new Animated.Value(0);
  handleAnimatingViewRef = ref => (this.animatedView = ref);
  handleAnimatingLoadingRef = ref => (this.animatedLoading = ref);
  handleBodyRef = ref => (this.animatedBody = ref);

  componentDidMount() {
    if (!this.props.preload) {
      this.setState({ hasFaded: true, isReady: true });
      return;
    }

    this.startLoadingAnimation();

    InteractionManager.runAfterInteractions(() => {
      this.handleLoadingFinished();
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.props.preload) {
      const { animationsReady } = this.state;
      const wasPreviouslyReady = animationsReady && this.props.contentReady;
      const isNowReady = animationsReady && newProps.contentReady;

      if (!wasPreviouslyReady && isNowReady) {
        this.setState({ isReady: true }, () =>
          setTimeout(this.handleAnimations, this.props.delay)
        );
      }
    }
  }

  handleLoadingFinished = () => {
    const wasPreviouslyReady = this.state.isReady;
    const isNowReady = this.props.contentReady;

    this.setState(
      {
        animationsReady: true,
        isReady: isNowReady,
      },
      () => {
        if (!wasPreviouslyReady && isNowReady) {
          //eslint-disable-next-line no-undef
          setTimeout(this.handleAnimations, this.props.delay);
        }
      }
    );
  };

  startLoadingAnimation = () => {
    Animated.loop(
      Animated.timing(this.spinnerAnimationValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();
  };
  handleAnimations = () => {
    invoke(this, 'animatedLoading.fadeOutDown', 250);

    if (has(this, 'animatedView.fadeOut')) {
      this.animatedView.fadeOut(this.props.duration).then(() => {
        this.setState({ hasFaded: true });
      });

      // Animate the content in as view is fading out
      setTimeout(() => {
        invoke(this, 'animatedBody.fadeIn');
      }, 100);
    }
  };

  renderLoader() {
    const spin = this.spinnerAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <Animated.View
        style={{
          height: 40,
          width: 40,
          alignItems: 'center',
          transform: [{ rotate: spin }],
        }}
      >
        <Icon icon="ios-ionic" style={{ position: 'absolute' }} />
      </Animated.View>
    );
  }

  renderContent = () => {
    if (this.props.keyboard && Platform.OS === 'ios') {
      return (
        <KeyboardShift {...this.props}>
          <StatusBar barStyle="light-content" />
          <View style={[styles.layout, this.props.style]} {...this.props}>
            {this.props.children}
          </View>
        </KeyboardShift>
      );
    } else if (this.props.keyboard && Platform.OS === 'android') {
      return (
        <KeyboardAvoidingView {...this.props} style={{ height: '100%' }}>
          <StatusBar barStyle="light-content" />
          <View style={[styles.layout, this.props.style]} {...this.props}>
            {this.props.children}
          </View>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <View style={[styles.layout, this.props.style]} {...this.props}>
          <StatusBar barStyle="light-content" />
          {this.props.children}
        </View>
      );
    }
  };

  render() {
    const { hasFaded, isReady } = this.state;
    // Only try and preload if necessary
    if (this.props.preload) {
      return (
        <View style={[styles.layout, this.props.style]} {...this.props}>
          <Try condition={!hasFaded}>
            <AnimatedView
              ref={this.handleAnimatingViewRef}
              style={styles.loadingContainer}
            >
              <AnimatedView ref={this.handleAnimatingLoadingRef}>
                {this.renderLoader()}
              </AnimatedView>
            </AnimatedView>
          </Try>
          <Try condition={isReady}>
            <AnimatedView
              ref={this.handleBodyRef}
              style={{
                opacity: 0,
                flex: 1,
              }}
            >
              {this.renderContent()}
            </AnimatedView>
          </Try>
        </View>
      );
    }
    // If no preload, just return the view
    else {
      return this.renderContent();
    }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'transparent',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  layout: {
    flex: 1,
  },
  header: {},
  body: {
    flex: 1,
  },
  footer: { marginBottom: 20 },
});

export default Layout;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  View,
  Image,
  TouchableOpacity,
  PanResponder,
  StyleSheet,
} from 'react-native';
import T from 'components/Typography';

const backgroundColors = {
  brand: '#e5129a',
  secondary: '#700b86',
  success: '#00c51e',
  error: '#ff6161',
  neutral: '#00C1FF',
};

function clamp(value, min, max) {
  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value;
}

const SWIPE_THRESHOLD = 120;
const TOUCH_THRESHOLD = 5;
export default class Notification extends Component {
  static propTypes = {
    notificationDismissed: PropTypes.func.isRequired,
    notification: PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      icon: PropTypes.any,
      onDismiss: PropTypes.func.isRequired,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          onPress: PropTypes.func.isRequired,
        })
      ).isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0),
      loadingState: new Animated.Value(0),
      loadingAnimation: null,
      exited: false,
      entered: false,
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, { dx, dy }) => {
        const draggedDown = dy > TOUCH_THRESHOLD;
        const draggedUp = dy < -TOUCH_THRESHOLD;
        const draggedLeft = dx < -TOUCH_THRESHOLD;
        const draggedRight = dx > TOUCH_THRESHOLD;

        return draggedDown || draggedUp || draggedLeft || draggedRight;
      },

      onPanResponderGrant: () => {
        this.state.pan.setOffset({ x: 0, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, { dy: this.state.pan.y }]),

      onPanResponderRelease: (e, { vy }) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vy >= 0) {
          velocity = clamp(vy, 3, 5);
        } else if (vy < 0) {
          velocity = clamp(vy * -1, 3, 5) * -1;
        }

        if (Math.abs(this.state.pan.y._value) > SWIPE_THRESHOLD) {
          Animated.decay(this.state.pan, {
            velocity: { x: 0, y: velocity },
            deceleration: 0.98,
          }).start(this.handleExited);
        } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 4,
          }).start();
        }
      },
    });

    if (this.props.notification.loading) {
      this.startLoadingSpinner();
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.notification.loading !== newProps.notification.loading) {
      if (newProps.notification.loading) {
        this.startLoadingSpinner();
      } else {
        this.stopLoadingSpinner();
      }
    }
  }

  startLoadingSpinner = () => {
    const animation = Animated.loop(
      Animated.timing(this.state.loadingState, {
        easing: Easing.linear,
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        isInteraction: false,
      })
    );
    animation.start();
    this.setState({ loadingAnimation: animation });
  };

  stopLoadingSpinner = () => {
    if (this.state.loadingAnimation) {
      this.state.loadingAnimation.stop;
    }
  };

  handleExited = () => {
    this.setState({ exited: true });
    if (this.props.notification.onDismiss) {
      this.props.notification.onDismiss();
    }
    this.props.notificationDismissed(this.props.notification);
  };

  handleLayout = e => {
    const height = e.nativeEvent.layout.height;
    if (!this.state.entered) {
      this.setState({ entered: true }, () =>
        Animated.spring(this.state.enter, {
          toValue: height,
          friction: 8,
        }).start()
      );
    }
  };

  render() {
    const { notification } = this.props;
    let { pan } = this.state;

    let translateY = pan.y;
    let opacity = pan.y.interpolate({
      inputRange: [-200, -SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD, 200],
      outputRange: [0.5, 1, 1, 1, 0.5],
    });

    if (this.state.exited) {
      opacity = 0;
    }

    let spin;
    if (notification.loading) {
      spin = this.state.loadingState.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });
    }

    let animatedCardStyles = { transform: [{ translateY }], opacity };
    return (
      <Animated.View
        onLayout={this.handleLayout}
        style={[
          styles.card,
          styles.container,
          animatedCardStyles,
          { backgroundColor: backgroundColors[notification.type || 'neutral'] },
        ]}
        {...this._panResponder.panHandlers}
      >
        <View style={styles.touchIndicatorContainer}>
          <View style={styles.touchIndicator} />
        </View>
        <View style={styles.mainSection}>
          {notification.loading ? (
            <View style={styles.loadingContainer}>
              <Animated.View
                style={[
                  { transform: [{ rotate: spin }] },
                  styles.loadingCircle,
                ]}
              />
              <Image
                source={require('assets/boar_icon.png')}
                style={styles.loadingIcon}
              />
            </View>
          ) : null}
          {!notification.loading && notification.icon ? (
            <Image source={notification.icon} style={styles.icon} />
          ) : null}
          <View style={styles.body}>
            <T.SubHeading style={styles.header}>
              {notification.title}
            </T.SubHeading>
            <T.Light style={styles.content}>{notification.content}</T.Light>
          </View>
        </View>
        {notification.actions && notification.actions.length > 0 ? (
          <View style={styles.buttonContainer}>
            {notification.actions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.button,
                  notification.actions.length > 1
                    ? styles.multipleActions
                    : styles.singleAction,
                  {
                    borderRightWidth:
                      notification.actions.length > 1 &&
                      i < notification.actions.length - 1
                        ? 1
                        : 0,
                  },
                ]}
                onPress={action.onPress}
              >
                <T.SubHeading style={styles.buttonText}>
                  {action.title}
                </T.SubHeading>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    left: 10,
    padding: 20,
    paddingTop: 0,
    borderRadius: 5,
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loadingContainer: {
    height: 50,
    width: 50,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loadingCircle: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    borderRadius: 50,
    borderWidth: 3,
    borderTopWidth: 3,
    borderTopColor: 'white',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  loadingIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  icon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    marginRight: 15,
  },
  body: {
    flex: 1,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  content: {
    fontSize: 12,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    marginTop: 15,
  },
  button: {
    alignSelf: 'center',
  },
  multipleActions: {
    padding: 10,
    marginBottom: -10,
    borderRightColor: 'rgba(255,255,255,0.2)',
    flex: 1,
  },
  singleAction: {
    width: '100%',
    marginBottom: -20,
    paddingBottom: 20,
    paddingTop: 20,
    marginTop: -10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  touchIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchIndicator: {
    height: 5,
    borderRadius: 5,
    margin: 10,
    width: '15%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Easing,
  View,
  ViewPropTypes,
  Text,
} from 'react-native';
import { gradients } from 'styles';
import LinearGradient from 'react-native-linear-gradient';

export default class ProgressBar extends Component {
  static propTypes = {
    description: PropTypes.string,
    percentage: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    onComplete: PropTypes.func,
  };

  state = {
    progressWidth: 0,
  };

  componentWillMount() {
    this.widthValue = new Animated.Value(0);
    this.updatePercentage(this.props.percentage);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.percentage !== this.props.percentage) {
      this.updatePercentage(this.props.percentage);
    }
  }

  updatePercentage = percentage => {
    Animated.timing(this.widthValue, {
      toValue: percentage,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
      isInteraction: false,
    }).start(() => {
      if (this.props.onComplete && percentage === 1) {
        this.props.onComplete();
      }
    });
  };

  handleLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) => {
    this.setState({ progressWidth: width });
  };

  render() {
    const { style, description } = this.props;
    const translateX = this.widthValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-this.state.progressWidth, 0],
    });

    return (
      <View style={[style, styles.container]}>
        <View style={styles.progressContainer} onLayout={this.handleLayout}>
          <Animated.View
            style={[styles.progressAnimation, { transform: [{ translateX }] }]}
          >
            <LinearGradient
              start={gradients.horizontal.start}
              end={gradients.horizontal.end}
              colors={gradients.pink}
              style={styles.progressBar}
            />
          </Animated.View>
        </View>
        {description && (
          <View style={styles.descriptionContainer}>
            <View style={styles.bump} />
            <View style={styles.textContainer}>
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#3C434B',
    overflow: 'hidden',
    borderRadius: 20,
  },
  progressAnimation: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  progressBar: {
    flex: 1,
    borderRadius: 20,
  },
  descriptionContainer: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#3C434B',
  },
  description: {
    color: 'white',
  },
  bump: {
    height: 5,
    width: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: '#3C434B',
  },
});

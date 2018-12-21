import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { getColors } from 'styles';

export default class SparkLine extends React.Component {
  static propTypes = {
    positive: PropTypes.bool.isRequired,
    children: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  state = {
    width: 0,
    height: 0,
  };

  handleLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => {
    this.setState({
      width: width ? width : Dimensions.get('window').width,
      height,
    });
  };

  render() {
    const { width, height } = this.state;
    const { positive, children } = this.props;

    const themeColors = getColors();

    const maxValue = Math.max(...children);
    const minValue = Math.min(...children);
    const range = maxValue - minValue;
    const distance = width / (children.length - 1);
    const renderablePoints = children
      .map((v, i) => ({
        y: ((v - minValue) * height) / range,
        x: distance * i + (i ? distance : 0),
      }))
      .map(v => `${v.x},${-v.y + height}`);

    return (
      <View onLayout={this.handleLayout} style={styles.container}>
        {!width || !height ? null : (
          <Svg height={`${height}`} width={`${width}`}>
            <Polyline
              points={renderablePoints.join(' ')}
              fill="none"
              stroke={
                positive ? themeColors.chartPositive : themeColors.chartNegative
              }
              strokeWidth="1"
            />
          </Svg>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dot: {
    marginRight: 2,
    marginLeft: 2,
  },
});

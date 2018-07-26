/*
  Usage:

  export const ENTRIES = [
    {
      title: 'My Balance',
      amount: '$86,753.09',
      change: '+5.65',
      colors: ['#129161', '#0C6169'],
    },
    {
      title: 'My Balance',
      amount: '$86,753.09',
      change: '+5.65',
      colors: ['#A55324', '#AE2282'],
    },
    {
      title: 'My Balance',
      amount: '$86,753.09',
      change: '+5.65',
      colors: ['#0C6169', '#129161'],
    },
  ];

  {ENTRIES.map(item => (
    <Card
      title={item.title}
      amount={item.amount}
      change={item.change}
      colors={item.colors}
    />
  ))}

 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Try } from 'components/Conditional';
import PortfolioChart from 'containers/PortfolioChart';
import SVG, {Path} from 'react-native-svg';

const { width: viewportWidth } = Dimensions.get('window');

function calcWidth(percentage) {
  const value = percentage * viewportWidth / 100;
  return Math.round(value);
}

const slideWidth = calcWidth(75);
const itemHorizontalMargin = calcWidth(2);

export const cardWidth = slideWidth + itemHorizontalMargin * 2;
export const cardHeight = slideWidth * 1.618 * 0.4;

export default class Card extends Component {
  static propTypes = {
    iconPath: PropTypes.string,
    colors: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    additionalInfo: PropTypes.node,
    style: ViewPropTypes.style,
  };

  render() {
    const {
      additionalInfo,
      colors,
      iconPath,
      style,
      subtitle,
      title,
    } = this.props;

    return (
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={colors}
        style={[
          styles.card,
          style,
        ]}
      >
        <View style={styles.top}>
          <View style={styles.titleContainer}>
            <Try condition={!!iconPath}>
              <SVG
                style={{marginRight: 2}}
                height="15"
                width="15"
                viewBox="0 0 49 49"
                preserveAspectRatio="none"
              >
                <Path
                  fill="#fFf"
                  d={iconPath}
                />
              </SVG>
            </Try>
            <Text style={[styles.text, styles.title]}>
              {title}
            </Text>
          </View>
          <Text style={[styles.text, styles.subtitle]}>
            {subtitle}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <PortfolioChart
            style={styles.chart}
            wallets={this.props.walletsToChart}
            colors={colors}
          />
        </View>
        <Try condition={!!additionalInfo}>
          <View style={styles.bottom}>
            <Text style={[styles.text, styles.additionalInfo]}>
              {additionalInfo}
            </Text>
          </View>
        </Try>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: cardHeight,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  top: {
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  text: {
    color: 'white'
  },
  icon: {
    height: 15,
    width: 15,
    marginRight: 5,
  },
  title: {
    fontSize: 15,
    fontFamily: 'HelveticaNeue-Medium',
    fontWeight: '500',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 26,
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    textAlign: 'left',
    letterSpacing: 0,
  },
  bottom: {
    alignItems: 'flex-end',
  },
  chart: {
    marginBottom: -20,
    marginHorizontal: -20,
  },
  additionalInfo: {
    fontSize: 14,
    fontFamily: 'HelveticaNeue',
    textAlign: 'left',
  },
});

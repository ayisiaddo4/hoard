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

const { width: viewportWidth } = Dimensions.get('window');

function calcWidth(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideWidth = calcWidth(75);
const itemHorizontalMargin = calcWidth(2);

export const cardWidth = slideWidth + itemHorizontalMargin * 2;
export const cardHeight = slideWidth * 1.618 * 0.4;

export default class Card extends Component {
  static propTypes = {
    icon: Image.propTypes.source,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    additionalInfo: PropTypes.node,
    style: ViewPropTypes.style,
  };

  render() {
    const { additionalInfo, colors, icon, style, subtitle, title } = this.props;

    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          colors={colors}
          style={[styles.card, style]}
        >
          <View style={styles.top}>
            <View style={styles.titleContainer}>
              <Try condition={!!icon}>
                <Image
                  style={{
                    height: 15,
                    width: 15,
                    marginRight: 2,
                    resizeMode: 'contain',
                  }}
                  source={icon}
                />
              </Try>
              <Text style={[styles.text, styles.title]}>{title}</Text>
            </View>
            <Text style={[styles.text, styles.subtitle]}>{subtitle}</Text>
          </View>
          <View style={{ flex: 1 }}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: cardHeight,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 0.16,
  },
  card: {
    flex: 1,
    height: cardHeight,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  top: {},
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  text: {
    color: 'white',
  },
  icon: {
    height: 15,
    width: 15,
    marginRight: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
    fontFamily: 'HelveticaNeue',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
  },
  subtitle: {
    fontFamily: 'HelveticaNeue',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
    textAlign: 'left',
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

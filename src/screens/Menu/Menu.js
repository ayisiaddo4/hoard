/**
 * Custom Drawer Menu
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { signOut } from 'sagas/authentication';
import {
  allPricesLoadedSelector,
  totalHoldingsSelector,
} from 'sagas/pricing/selectors';
import {
  isSignedInSelector,
  userFullNameSelector,
} from 'containers/User/selectors';
import NavigatorService from 'lib/navigator';
import { gradients, calculateHitSlop } from 'styles';
import LinearGradient from 'react-native-linear-gradient';
import Conditional, { Try, Otherwise } from 'components/Conditional';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-navigation';
import { t } from 'translations/i18n';

const menuHitSlop = calculateHitSlop(40, 20);
const linkHitSlop = calculateHitSlop(15, Infinity);

class Menu extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    isSignedIn: PropTypes.bool,
    userFullName: PropTypes.string,
    totalHoldings: PropTypes.number,
    allPricesLoaded: PropTypes.bool,
    signOut: PropTypes.func.isRequired,
  };

  navigateTo = route => {
    NavigatorService.navigate(route);
  };

  render() {
    return (
      <LinearGradient
        start={gradients.vertical.start}
        end={gradients.vertical.end}
        colors={gradients.blue}
        style={{ flex: 1, height: '100%' }}
      >
        <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
          <SafeAreaView
            forceInset={{ top: 'always' }}
            style={styles.closeWrapper}
          >
            <TouchableOpacity
              hitSlop={menuHitSlop}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 0,
              }}
              onPress={() => NavigatorService.closeDrawer()}
            >
              <Icon icon="ios-close-outline" />
            </TouchableOpacity>
          </SafeAreaView>

          <ScrollView style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.header}>
                <Try condition={Config.CURRENCY_NETWORK_TYPE === 'test'}>
                  <View style={styles.testnetContainer}>
                    <View style={styles.testnetBackground}>
                      <Text style={styles.testnetText}>Testnet Version</Text>
                    </View>
                  </View>
                </Try>
              </View>
              <Try
                condition={this.props.isSignedIn && !!this.props.userFullName}
              >
                <Text style={styles.userFullName}>
                  {this.props.userFullName}
                </Text>
              </Try>
              <Text
                style={[
                  styles.totalHoldings,
                  this.props.allPricesLoaded
                    ? styles.totalHoldingsLoaded
                    : styles.totalHoldingsRequesting,
                ]}
              >
                ${this.props.totalHoldings.toFixed(2)}
              </Text>

              <View style={[styles.subHeadingContainer, styles.divider]}>
                <Text style={styles.subHeading}>{t('menu.title')}</Text>
              </View>
              <TouchableOpacity
                hitSlop={linkHitSlop}
                style={styles.linkWrapper}
                onPress={() => this.navigateTo('Wallet')}
              >
                <Text style={styles.linkContent}>{t('menu.wallet')}</Text>
              </TouchableOpacity>

              <View style={[styles.subHeadingContainer, styles.divider]}>
                <Text style={styles.subHeading}>{t('menu.manage')}</Text>
              </View>
              <TouchableOpacity
                hitSlop={linkHitSlop}
                style={[styles.linkWrapper, styles.divider]}
                onPress={() => this.navigateTo('GetHelp')}
              >
                <Text style={styles.linkContent}>{t('menu.help')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={linkHitSlop}
                style={styles.linkWrapper}
                onPress={() => this.navigateTo('Settings')}
              >
                <Text style={styles.linkContent}>{t('menu.settings')}</Text>
              </TouchableOpacity>

              <View style={[styles.subHeadingContainer, styles.divider]}>
                <Text style={styles.subHeading}>{t('menu.about')}</Text>
              </View>
              <TouchableOpacity
                style={[styles.linkWrapper, styles.divider]}
                onPress={() => this.navigateTo('About')}
                hitSlop={linkHitSlop}
              >
                <Text style={styles.linkContent}>{t('menu.about')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={linkHitSlop}
                style={styles.linkWrapper}
                onPress={() => this.navigateTo('Legal')}
              >
                <Text style={styles.linkContent}>{t('menu.legal')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.footerContainer}>
            <Conditional>
              <Try condition={this.props.isSignedIn}>
                <Button type="base" onPress={() => this.props.signOut()}>
                  {t('actions.log_out')}
                </Button>
              </Try>
              <Otherwise>
                <Button type="base" onPress={() => this.navigateTo('Login')}>
                  {t('menu.signup_login')}
                </Button>
              </Otherwise>
            </Conditional>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSignedIn: isSignedInSelector(state),
    allPricesLoaded: allPricesLoadedSelector(state),
    totalHoldings: totalHoldingsSelector(state),
    userFullName: userFullNameSelector(state),
  };
}

export default connect(
  mapStateToProps,
  { signOut }
)(Menu);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeWrapper: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  body: {
    padding: 20,
    backgroundColor: 'transparent',
    flex: 1,
  },
  header: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  testnetContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  testnetBackground: {
    padding: 7.5,
    paddingHorizontal: 15,
    backgroundColor: '#ff6161',
    borderRadius: 20,
    marginRight: 'auto',
  },
  testnetText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footerContainer: {
    padding: 20,
  },
  userFullName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 16,
  },
  totalHoldings: {
    fontSize: 16,
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 20,
  },
  totalHoldingsLoaded: {
    color: '#FFFFFF',
  },
  totalHoldingsRequesting: {
    color: '#999',
  },
  linkWrapper: {
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 14,
  },
  subHeadingContainer: {
    paddingVertical: 20,
    marginBottom: 20,
  },
  subHeading: {
    marginTop: 20,
    color: '#9DA0A5',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0,
  },
  divider: {
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(151, 151, 151, 0.21)',
  },
  linkContent: {
    flex: 1,
    color: '#ffffff',
    fontWeight: '700',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
});

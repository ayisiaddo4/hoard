import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Button from 'components/Button';
import T from 'components/Typography';
import Animations, { FADE, SLIDE_Y } from 'hocs/Animations';
import { Layout, Body, Header, Footer } from 'components/Base';
import { t } from 'translations/i18n';
import { asyncNextFrame } from 'sagas/transactions/helpers';

export default class WordList extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.string).isRequired,
    offset: PropTypes.number.isRequired,
    totalLength: PropTypes.number.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
    }).isRequired,
    goBack: PropTypes.func.isRequired,
    saveAndContinue: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    animateList: false,
    exitAnimation: false,
  };

  componentDidMount() {
    this.startListAnimation();
    this.setNavigation();
  }

  setNavigation = () => {
    this.props.navigation.setParams({
      leftAction: this.props.goBack,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.startListAnimation();
    }
  }

  startListAnimation = () => {
    this.setState({ animateList: true });
  };

  animationDidFinish = () => {
    this.setState({ animateList: false });
  };

  handleNextButton = () => {
    this.setState({ loading: true }, async () => {
      await asyncNextFrame();
      this.setState({ animateList: false, exitAnimation: true });
    });
  };

  handleExitAnimation = async () => {
    await asyncNextFrame();
    this.props.saveAndContinue();
  };

  render() {
    const { animateList, exitAnimation } = this.state;

    return (
      <Layout>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingStyle}>
              {t('wallet.your_words')}
            </T.Heading>
            <T.Light style={styles.text}>
              {t('wallet.your_words_description')}
            </T.Light>
          </Header>
          <Body>
            <Animations
              style={{ marginTop: 20 }}
              animations={[
                { type: FADE, parameters: { start: 0, end: 1 } },
                { type: SLIDE_Y, parameters: { start: 80, end: 0 } },
              ]}
              enterDelay={50}
              enterDuration={500}
              enterStagger={100}
              exitDelay={0}
              exitDuration={100}
              exitStagger={30}
              startAnimation={animateList}
              onEnterComplete={this.animationDidFinish}
              exitAnimation={exitAnimation}
              onExitComplete={this.handleExitAnimation}
            >
              {this.props.list.map((word, i) => {
                return (
                  <View key={`word-${i}`} style={styles.mnemonicChoice}>
                    <T.Light style={styles.mnemonicChoiceNumner}>
                      {`0${i + this.props.offset}`.slice(-2)}
                    </T.Light>
                    <T.SemiBold style={styles.mnemonicChoiceText}>
                      {word}
                    </T.SemiBold>
                  </View>
                );
              })}
            </Animations>
          </Body>
          <Footer>
            <T.Light
              style={{
                color: 'lightgrey',
                textAlign: 'center',
                paddingBottom: 10,
              }}
            >
              {this.props.list.length + this.props.offset - 1} of{' '}
              {this.props.totalLength} words
            </T.Light>
            <Button
              loading={this.state.loading}
              disabled={this.state.animateList || exitAnimation}
              onPress={this.handleNextButton}
            >
              {t('actions.next')}
            </Button>
          </Footer>
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  headingStyle: {
    marginVertical: 20,
    paddingBottom: 0,
    color: '#ffffff',
  },
  text: {
    color: '#fff',
    fontWeight: '200',
    fontSize: 16,
  },
  mnemonicChoice: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#272D35',
    opacity: 0.5,
    marginBottom: 10,
    flexDirection: 'row',
  },
  mnemonicChoiceNumner: {
    textAlign: 'center',
    color: '#ffffff',
    marginRight: 20,
    fontSize: 16,
  },
  mnemonicChoiceText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },
});

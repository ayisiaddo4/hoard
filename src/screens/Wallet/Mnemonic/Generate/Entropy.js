import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  PanResponder,
  StyleSheet,
  Image,
  View
} from 'react-native';
import SVG, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import {CircularProgress} from 'react-native-svg-circular-progress';
import { t } from 'translations/i18n';

import Conditional, { Try, Otherwise } from 'components/Conditional';
import Button from 'components/Button';
import T from 'components/Typography';
import { Layout, Body, Header, Footer } from 'components/Base';

const LANG_BACK_TEXT = 'back';

const MAX_DATA_POINTS = 150;
const SAMPLE_EVERY_X = 7;

export default class Entropy extends Component {
  static propTypes = {
    saveAndContinue: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };

  state = {
    loading: false,
    isRecording: false,
    movement: [],
    yOffset: 0,
    xOffset: 0,
    drawableHeight: 0,
    drawableWidth: 0
  };

  panResponder = null;

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderGrant: () => this.setState({ isRecording: true }),
      onPanResponderMove: ({nativeEvent: {pageX, pageY}}, gestureState) => this.setState({
        movement: [...this.state.movement, {...gestureState, pageX, pageY, time: Date.now()}]
      }),
      onPanResponderRelease: () => this.setState({ isRecording: false })
    });
  }

  componentDidMount() {
    this.setNavigation();
  }

  componentWillUnmount() {
    const interactionHandle = this.panResponder.getInteractionHandle();

    if (interactionHandle) {
      InteractionManager.clearInteractionHandle(interactionHandle);
    }
  }

  handleLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.viewRef.measure((x, y, w, h, xOffset, yOffset) =>
      this.setState({
        drawableWidth: width ? width : Dimensions.get('window').width,
        drawableHeight: height,
        xOffset,
        yOffset
      })
    );
  };

  setNavigation = () => {
    this.props.navigation.setParams({
      leftAction: this.handleGoBack,
    });
  };

  handleGoBack = () => {
    this.props.navigation.setParams({
      leftAction: null,
      title: null,
    });
    this.props.goBack();
  };

  handleNextButton = () => {
    this.setState(
      {loading: true},
      () => {
        /* here we are grabbing all of the integer values from the movement data
        * that we are recording in the `onPanResponderMove` callback.
        *
        * this should include x/y positions, x/y velocities, and the timestamp
        * for each of those movements.
        *
        * we then strip out all non-integer values, so we can pass all of that
        * as hex data to our mnemonic phrase generator.
        */

        const str = this.state.movement.reduce(
          (accumulator, data, i) => {
            if (i % SAMPLE_EVERY_X === 0) {
              return accumulator + Object.values(data).join('');
            }
            return accumulator;
          },
          ''
        ).replace(/[^0-9]/g, '');

        this.props.saveAndContinue(`0x${str}`);
      }
    );
  }

  setViewRef = ref => this.viewRef = ref;

  render() {
    const {drawableWidth, drawableHeight, movement, yOffset, xOffset } = this.state;

    const percentageComplete = (movement.length / MAX_DATA_POINTS) * 100;
    const finished = percentageComplete === 100;

    let progressText = t('wallet.entropy_start');
    if (finished) {
      progressText = t('wallet.entropy_finished');
    } else if (percentageComplete >= 75) {
      progressText = t('wallet.entropy_almost');
    } else if (movement.length) {
      progressText = t('wallet.entropy_keep_going');
    }


    const path = movement.map((v, i) => {
      const verb = i === 0 ? 'M' : 'L';
      return `${verb}${parseInt(v.pageX - xOffset)} ${parseInt(v.pageY - yOffset)}`;
    }).join(' ');

    const responders = finished ? {} : {...this.panResponder.panHandlers};

    return (
      <Layout preload={false} style={styles.layout}>
        <Header style={styles.header}>
          <T.Heading style={styles.heading}>
            {t('wallet.entropy_heading')}
          </T.Heading>
        </Header>
        <Body style={styles.body}>
          <View ref={this.setViewRef} onLayout={this.handleLayout} style={styles.drawBox} {...responders}>
            <Try condition={drawableWidth && drawableHeight && movement.length}>
              <SVG height={`${drawableHeight}`} width={`${drawableWidth}`}>
                <LinearGradient id="grad" y1="0" x1="0" y2={drawableHeight.toString()} x2={drawableWidth.toString()}>
                  <Stop offset="0" stopColor="rgb(153,47,238)" />
                  <Stop offset="0.25" stopColor="rgb(230,34,131)" />
                  <Stop offset="0.75" stopColor="rgb(230,34,131)" />
                  <Stop offset="1" stopColor="rgb(153,47,238)" />
                </LinearGradient>
                <Path
                  d={path}
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </SVG>
            </Try>
          </View>
        </Body>
        <Footer style={styles.footer}>
          <Try condition={!finished}>
            <CircularProgress
              percentage={percentageComplete}
              blankColor="rgba(151, 151, 151, 0.3)"
              donutColor="#e6228d"
              progressWidth="46"
              fillColor="#1b1c23"
              size={100}
            >
              <T.Light style={styles.percentage}>{parseInt(percentageComplete)}%</T.Light>
            </CircularProgress>
          </Try>
          <T.SubHeading style={[styles.progressText, styles.snapToBottom]}>{progressText}</T.SubHeading>
          <Try condition={finished}>
            <Button
              style={[styles.nextButton, styles.snapToBottom]}
              onPress={this.handleNextButton}
              loading={this.state.loading}>
              {t('actions.next')}
            </Button>
          </Try>
        </Footer>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    padding: 20,
    flex: 1,
  },
  header: {
  },
  heading: {
    color: 'white',
  },
  body: {
    flex: 2,
    paddingVertical: 20,
  },
  drawBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3E434B',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: 'white',
  },
  percentage: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: '400'
  },
  nextButton: {
    width: '100%',
  },
  snapToBottom: {
    marginTop: 'auto',
  },
});

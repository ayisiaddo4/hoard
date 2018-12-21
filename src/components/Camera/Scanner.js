/*
  Code Taken & Modified from react-native-qr-scanner (https://github.com/shifeng1993/react-native-qr-scanner)
  MIT License
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import { View } from 'react-native';

import QRScannerView from './ScannerView';

/**
 * 扫描界面
 */
export default class QRScanner extends PureComponent {
  static defaultProps = {
    onRead: () => {},
    renderTopView: () => {},
    renderBottomView: () => (
      <View style={{ flex: 1, backgroundColor: '#0000004D' }} />
    ),
    rectHeight: 200,
    rectWidth: 200,
    flashMode: false,
    finderX: 0,
    finderY: 0,
    zoom: 0,
    translucent: false,
    isRepeatScan: false,
  };

  handleOnRead = event => {
    this.props.onRead(event.data);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <RNCamera
          style={{
            flex: 1,
          }}
          onBarCodeRead={this.handleOnRead}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={
            !this.props.flashMode
              ? RNCamera.Constants.FlashMode.off
              : RNCamera.Constants.FlashMode.torch
          }
          zoom={this.props.zoom}
        >
          <QRScannerView
            maskColor={this.props.maskColor}
            cornerColor={this.props.cornerColor}
            borderColor={this.props.borderColor}
            rectHeight={this.props.rectHeight}
            rectWidth={this.props.rectWidth}
            borderWidth={this.props.borderWidth}
            cornerBorderWidth={this.props.cornerBorderWidth}
            cornerBorderLength={this.props.cornerBorderLength}
            isLoading={this.props.isLoading}
            cornerOffsetSize={this.props.cornerOffsetSize}
            isCornerOffset={this.props.isCornerOffset}
            bottomHeight={this.props.bottomHeight}
            scanBarAnimateTime={this.props.scanBarAnimateTime}
            scanBarColor={this.props.scanBarColor}
            scanBarHeight={this.props.scanBarHeight}
            scanBarMargin={this.props.scanBarMargin}
            hintText={this.props.hintText}
            hintTextStyle={this.props.hintTextStyle}
            scanBarImage={this.props.scanBarImage}
            hintTextPosition={this.props.hintTextPosition}
            isShowScanBar={this.props.isShowScanBar}
            finderX={this.props.finderX}
            finderY={this.props.finderY}
            returnSize={this.barCodeSize}
          />
        </RNCamera>
      </View>
    );
  }

  barCodeSize = () => {}; // noop
}

QRScanner.propTypes = {
  isRepeatScan: PropTypes.bool,
  onRead: PropTypes.func,
  maskColor: PropTypes.string,
  borderColor: PropTypes.string,
  cornerColor: PropTypes.string,
  borderWidth: PropTypes.number,
  cornerBorderWidth: PropTypes.number,
  cornerBorderLength: PropTypes.number,
  rectHeight: PropTypes.number,
  rectWidth: PropTypes.number,
  isLoading: PropTypes.bool,
  isCornerOffset: PropTypes.bool,
  cornerOffsetSize: PropTypes.number,
  bottomHeight: PropTypes.number,
  scanBarAnimateTime: PropTypes.number,
  scanBarColor: PropTypes.string,
  scanBarImage: PropTypes.any,
  scanBarHeight: PropTypes.number,
  scanBarMargin: PropTypes.number,
  hintText: PropTypes.string,
  hintTextStyle: PropTypes.object,
  hintTextPosition: PropTypes.number,
  renderTopView: PropTypes.func,
  renderBottomView: PropTypes.func,
  isShowScanBar: PropTypes.bool,
  topViewStyle: PropTypes.object,
  bottomViewStyle: PropTypes.object,
  flashMode: PropTypes.bool,
  finderX: PropTypes.number,
  finderY: PropTypes.number,
  zoom: PropTypes.number,
  translucent: PropTypes.bool,
};

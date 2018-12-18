import React, { Component } from 'react';

export default function withoutOffscreenRendering(WrappedScreen) {
  if (Object.keys(WrappedScreen).includes('router')) {
    return WrappedScreen;
  }

  return class WithoutOffscreenRendering extends Component {
    state = { focused: false };

    componentDidMount() {
      this.didFocusSub = this.props.navigation.addListener('didFocus', () =>
        this.setState({ focused: true })
      );
      this.willBlurSub = this.props.navigation.addListener('willBlur', () =>
        this.setState({ focused: false })
      );
    }
    componentWillUnmount() {
      this.didFocusSub.remove();
      this.willBlurSub.remove();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.focused;
    }

    render() {
      return <WrappedScreen {...this.props} />;
    }
  };
}

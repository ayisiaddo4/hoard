import { Component } from 'react';
import PropTypes from 'prop-types';

export class Try extends Component {
  static propTypes = {
    children: PropTypes.oneOfType(
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ),
    condition: PropTypes.any,
  };

  render() {
    if (this.props.condition) {
      return this.props.children;
    }

    return null;
  }
}

export class Otherwise extends Component {
  static propTypes = {
    children: PropTypes.oneOfType(
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ),
  };
}

export default class Conditional extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;
    for (let i = 0; i < children.length; i++) {
      const Child = children[i];

      const isTry = Child.type === Try;
      const isOtherwise = Child.type === Otherwise;

      if ((isTry && Child.props.condition) || isOtherwise) {
        return Child.props.children;
      }
    }

    return null;
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import api from 'lib/api';

export function makeQueryString(queries) {
  if (queries && queries.length) {
    return `?${queries.map(q => `${q.name}=${q.value}`).join('&')}`;
  }

  return '';
}

export async function makeRequest(url, queries) {
  return api.get(`${url}${makeQueryString(queries)}`);
}

export default class Fetch extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired, // recieves {loaded: boolean, data: any}
    queries: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    url: PropTypes.string.isRequired,
    formatter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    formatter: json => json,
  };

  state = {
    loaded: false,
    data: '',
    requestNumber: 0,
  };

  componentWillMount() {
    this.handleRequest(this.props.queries, this.state.requestNumber);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.queries != newProps.queries) {
      this.setState(
        { loaded: false, requestNumber: this.state.requestNumber + 1 },
        () => this.handleRequest(newProps.queries, this.state.requestNumber)
      );
    }
  }

  handleRequest = async (queries, requestNumber) => {
    try {
      const json = await makeRequest(this.props.url, queries);
      if (this.state.requestNumber === requestNumber) {
        this.setState({
          loaded: true,
          data: this.props.formatter(json),
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.log('error! ', error); // eslint-disable-line no-console
      }
    }
  };

  render() {
    const { loaded, data } = this.state;
    return this.props.children({ loaded, data });
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import T from 'components/Typography';

export default function ErrorReport(props) {
  const { name, value } = props;

  if (typeof value === 'string') {
    return (
      <View>
        <T.Small style={styles.value}>
          {!!name && <T.SemiBold style={styles.name}>{name}: </T.SemiBold>}
          {props.value}
        </T.Small>
      </View>
    );
  } else if (Array.isArray(value)) {
    return (
      <View style={styles.indent}>
        {props.error.map((e, i) => (
          <ErrorReport key={i} value={e} />
        ))}
      </View>
    );
  } else {
    return (
      <View style={styles.indent}>
        {Object.keys(value).map(valueKey => (
          <ErrorReport key={valueKey} name={valueKey} value={value[valueKey]} />
        ))}
      </View>
    );
  }
}

// eslint-disable-next-line immutable/no-mutation
ErrorReport.propTypes = {
  name: PropTypes.any,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};

const styles = StyleSheet.create({
  indent: {
    marginLeft: 5,
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
  },
  value: {
    color: 'white',
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';

import SelectableImageRow from 'components/SelectableImageRow';
import T from 'components/Typography';

export default function SelectableImageList(props) {
  return (
    <View>
      {props.title && (
        <T.SubHeading style={styles.subheading}>{props.title}</T.SubHeading>
      )}
      <ScrollView bounces={false}>
        {props.items.map((item, i) => (
          <SelectableImageRow key={i} {...item} />
        ))}
      </ScrollView>
    </View>
  );
}

SelectableImageList.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape(SelectableImageRow.propTypes))
    .isRequired,
};

const styles = StyleSheet.create({
  subheading: {
    justifyContent: 'center',
  },
});

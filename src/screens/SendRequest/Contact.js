import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import Conditional, { Try, Otherwise } from 'components/Conditional';
import T from 'components/Typography';
import { stringToColor } from 'lib/string-helpers';

const exists = v => v;

export default function Contact({ contact, style, onPress }) {
  const title = [contact.givenName, contact.middleName, contact.familyName]
    .filter(exists)
    .join(' ');
  const initials = [contact.givenName, contact.familyName]
    .filter(exists)
    .map(v => v && v[0])
    .join();

  const inner = (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <Conditional>
          <Try condition={contact.hasThumbnail}>
            <Image
              source={{ uri: contact.thumbnailPath }}
              style={styles.image}
            />
          </Try>
          <Otherwise>
            <View
              style={[
                styles.background,
                { backgroundColor: stringToColor(contact.recordID) },
              ]}
            >
              <T.Light style={styles.initials}>{initials}</T.Light>
            </View>
          </Otherwise>
        </Conditional>
      </View>
      <T.Light style={styles.title}>{title}</T.Light>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{inner}</TouchableOpacity>;
  } else {
    return inner;
  }
}

Contact.propTypes = {
  contact: PropTypes.shape({
    familyName: PropTypes.string,
    givenName: PropTypes.string,
    hasThumbnail: PropTypes.bool,
    middleName: PropTypes.string,
    recordID: PropTypes.string.isRequired,
    thumbnailPath: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  background: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
  },
  title: {
    color: 'white',
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import T from 'components/Typography';

export default function SelectableImageHeader({
  emptyText,
  selection,
  title,
  onPress,
}) {
  console.log(selection, emptyText);
  return (
    <View style={styles.container}>
      {selection && <T.SubHeading style={styles.title}>{title}</T.SubHeading>}
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        {selection ? (
          <View style={styles.selectionContainer}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={selection.image} />
            </View>
            <View style={styles.textContainer}>
              <T.SemiBold style={styles.selectionTitle}>
                {selection.title}
              </T.SemiBold>
              <T.Light style={styles.selectionSubtitle}>
                {selection.subtitle}
              </T.Light>
            </View>
          </View>
        ) : (
          <T.SubHeading style={styles.emptyText}>{emptyText}</T.SubHeading>
        )}
      </TouchableOpacity>
    </View>
  );
}

SelectableImageHeader.propTypes = {
  imageSource: Image.propTypes.source,
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  touchable: {
    width: '100%',
  },
  selectionContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 5,
  },
  selectionTitle: {
    color: '#00c1ff',
    fontWeight: '500',
    fontSize: 18,
  },
  selectionSubtitle: {
    color: '#707c96',
    fontWeight: 'normal',
    fontSize: 15,
  },
  emptyText: {
    color: 'white',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    margin: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
  },
});

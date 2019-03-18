import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';
import T from 'components/Typography';
import Icon from 'components/Icon';

export default function ListItem({
  icon,
  imageSource,
  leftLarge,
  leftSmall,
  rightLarge,
  rightSmall,
  onLayoutLeftLarge,
  onLayoutRightLarge,
  onLayoutLeftSmall,
  onLayoutRightSmall,
}) {

  let imageComponent; // eslint-disable-line immutable/no-let
  if (imageSource) {
    imageComponent = (
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
      />
    );
  } else if (icon) {
    imageComponent = (
      <Icon style={{ size: 30, color: 'white' }} icon={icon} />
    );
  } else {
    imageComponent = (
      <View style={styles.image}/>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageComponent}
      </View>
      <View style={styles.leftSection}>
        <T.Light onLayout={onLayoutLeftLarge} style={styles.leftLarge}>
          {leftLarge}
        </T.Light>
        <T.Small onLayout={onLayoutLeftSmall} style={styles.leftSmall}>
          {leftSmall}
        </T.Small>
      </View>
      <View style={styles.rightSection}>
        <T.Light
          onLayout={onLayoutRightLarge}
          style={styles.rightLarge}
        >
          {rightLarge}
        </T.Light>
        <T.Small onLayout={onLayoutRightSmall} style={styles.rightSmall}>
          {rightSmall}
        </T.Small>
      </View>
    </View>
  );
}

// eslint-disable-next-line immutable/no-mutation
ListItem.propTypes = {
  icon: PropTypes.string,
  imageSource: Image.propTypes.source,
  leftLarge: PropTypes.string,
  leftSmall: PropTypes.string,
  rightLarge: PropTypes.string,
  rightSmall: PropTypes.string,
  onLayoutLeftLarge: PropTypes.func,
  onLayoutRightLarge: PropTypes.func,
  onLayoutLeftSmall: PropTypes.func,
  onLayoutRightSmall: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    marginHorizontal: 20,
    backgroundColor: '#202934',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderRadius: 5,
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    justifyContent: 'center',
    marginRight: 13,
  },
  image: {
    height: 30,
    width: 30,
  },
  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  leftLarge: {
    fontFamily: 'HelveticaNeue',
    fontSize: 19,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22.5,
    marginBottom: 5,
    letterSpacing: 0,
    color: '#ffffff',
  },
  leftSmall: {
    fontFamily: 'HelveticaNeue',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    color: '#bfc0c3',
  },
  rightSection: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
  },
  rightLarge: {
    fontFamily: 'HelveticaNeue',
    fontSize: 19,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22.5,
    marginBottom: 5,
    letterSpacing: 0,
    color: '#ffffff',
  },
  rightSmall: {
    fontFamily: 'HelveticaNeue',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    color: '#bfc0c3',
  },
});

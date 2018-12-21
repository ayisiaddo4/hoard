import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SelectableImageRow({
  onPress,
  selected,
  image,
  title,
  subtitle,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          { borderColor: selected ? 'rgba(0, 193, 255, 0.5)' : 'transparent' },
        ]}
      >
        <Image style={styles.image} source={image} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

SelectableImageRow.propTypes = {
  image: Image.propTypes.source,
  selected: PropTypes.bool.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    backgroundColor: '#202934',
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8cbcbd',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '100',
    color: '#8cbcbd',
  },
});

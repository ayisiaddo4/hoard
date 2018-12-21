import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { t } from 'translations/i18n';
export default function Modal({
  children,
  height,
  show,
  title,
  onCancel,
  onDone,
}) {
  return (
    <View
      style={[styles.container, { display: show ? 'flex' : 'none', height }]}
    >
      <TouchableOpacity onPress={onCancel}>
        <Text style={styles.xButton}>X</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
      {children}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.done} onPress={onDone}>
          <Text>{t('actions.done')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
          <Text>{t('actions.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  height: PropTypes.string,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  height: '95%',
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingHorizontal: 30,
    paddingTop: 30,
    left: 10,
    right: 10,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  xButton: {
    alignSelf: 'flex-end',
    fontSize: 30,
    fontWeight: '100',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 25,
    fontWeight: '900',
  },
  actionButtons: {
    width: '100%',
    marginTop: 'auto',
    alignItems: 'center',
  },
  done: {
    width: '100%',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderRadius: 30,
    padding: 20,
  },
  cancel: {
    padding: 20,
  },
});

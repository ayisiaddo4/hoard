import React from 'react';
import { View, StyleSheet } from 'react-native';
import T from 'components/Typography';
import { Layout } from 'components/Base';

export default function Legal() {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          <T.Heading style={styles.title}>Privacy</T.Heading>
          <T.Light style={styles.title}>Coming Soon...</T.Light>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    color: 'white',
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Layout, Body, Header, Footer } from 'components/Base';
import { Header as NavHeader } from 'components/Base/Navigation';
import T from 'components/Typography';
import { colors } from 'styles';

export default function Modal({ children, footer, title }) {
  return (
    <Layout style={styles.container}>
      <Header>
        <NavHeader
          leftAction="cancel"
          rightAction={null}
          containerStyle={{ backgroundColor: colors.blueGray }}
        />
      </Header>
      <Body style={styles.body}>
        <T.Heading style={styles.heading}>{title}</T.Heading>
        {children}
      </Body>
      {!!footer && <Footer style={styles.footer}>{footer}</Footer>}
    </Layout>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  footer: PropTypes.node,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    backgroundColor: colors.blueGray,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    flex: 1,
    marginTop: 40,
  },
  body: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  heading: {
    marginBottom: 20,
    color: 'white',
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
});

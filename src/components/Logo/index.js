import React from 'react';
import { Image } from 'react-native';

const Logo = () => {
  return (
    <Image
      style={{ width: 50, height: 50, resizeMode: 'contain' }}
      source={require('assets/HoardLogoWhite.png')}
    />
  );
};

export default Logo;

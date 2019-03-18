import { Image } from 'react-native';

export function getScaledImageWidth(desiredHeight, asset) {
  const metadata = Image.resolveAssetSource(asset);
  const scalingFactor = desiredHeight / metadata.height;

  return metadata.width * scalingFactor;
}

export function getScaledImageHeight(desiredWidth, asset) {
  const metadata = Image.resolveAssetSource(asset);
  const scalingFactor = desiredWidth / metadata.width;

  return metadata.height * scalingFactor;
}

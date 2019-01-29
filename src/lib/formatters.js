import { utils } from 'ethers';

export const exponentialToDecimal = stringNumber => {
  const [fullMatch, integers, decimals = '', isExponent, exponent] = String(
    stringNumber
  ).match(/(\d+)?\.?(\d+)?([eE])?(-?\d+)?/);

  if (isExponent) {
    // find out how many decimals we will be moving
    const numExponent = Number(exponent);

    // make enough 0s to enable the padding
    const padding = '0'.repeat(Math.abs(numExponent));

    let finalIntegers, finalDecimals; // eslint-disable-line immutable/no-let

    // if negative exponent
    if (numExponent < 0) {
      // we're going to be making the number smaller so
      // put 0s to left of the beginning of the integers
      const paddedInts = `${padding}${integers}`;

      // move the "point" location to the left from the end of our integers
      finalIntegers = paddedInts.slice(0, numExponent);
      // and add any to the right of our new point location to the decimals
      finalDecimals = `${paddedInts.slice(numExponent)}${decimals}`;
    } else {
      // otherwise we're going to be making the number larger
      // so put 0s to right of the end of the decimals
      const paddedDecimals = `${decimals}${padding}`;

      // move the "point" location to the right from the start of our decimals
      // and add the numbers to the left of that point to our integers
      finalIntegers = `${integers}${paddedDecimals.slice(0, numExponent)}`;
      // and keep the rest as our true decimal value
      finalDecimals = paddedDecimals.slice(numExponent);
    }

    // remove trailing 0s from decimals
    const trimmedDecimals = finalDecimals.replace(/0*$/, '');

    // ensure there is only one leading 0 on integers
    const trimmedIntegers =
      finalIntegers.replace(/^0*/, '') || '0'; // trim leading 0s // ensure there is at least 1 leading 0 if no integers

    // if there are decimals after trimming
    // return integers and decimals separated by "."
    if (trimmedDecimals.length) {
      return `${trimmedIntegers}.${trimmedDecimals}`;
    }

    // otherwise return only the integers
    return trimmedIntegers;
  } else {
    // if there is no exponent, just return the number without doing work
    return fullMatch;
  }
};

export const limitNumber = PRECISION => value =>
  Number(value.toFixed(PRECISION));

export const limitDecimalString = PRECISION => value => {
  const halves = exponentialToDecimal(value).split('.');
  const [integers, decimals] = halves;
  if (halves.length === 2) {
    return `${integers}.${decimals.substring(0, PRECISION)}`;
  } else {
    return integers;
  }
};

export const formatDecimalInput = PRECISION => {
  const limiter = limitDecimalString(PRECISION);
  return value => {
    const matches = String(value).match(/(\d+)?(\.)?(\d+)?(e-?\d+)?/);
    return limiter(matches ? matches[0] : '');
  };
};

export const bigNumberToEther = bigNumber =>
  utils.formatEther(bigNumber.toString());

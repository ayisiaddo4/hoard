export function underlinesToSpaces(s) {
  return s
    .split('_')
    .join(' ')
    .replace('  ', ' ');
}

export function snakeToCamel(s) {
  return s.replace(/_\w/g, m => m[1].toUpperCase());
}

export function camelToTitle(s) {
  return s
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./, match => match.toUpperCase())
    .trim();
}

// https://gist.github.com/SonyaMoisset/aa79f51d78b39639430661c03d9b1058#file-title-case-a-sentence-for-loop-wc-js
export function toTitleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

export function stringToColor(str) {
  let hash = 0;
  let color = '#';

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

export function  validateEmail({ email_address }) {
  const MATCH_PATTERN = '^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]+$';

  if (!email_address) {
    return { error: 'An email is required'};
  }

  if (!email_address.toString().match(MATCH_PATTERN) ) {
    return{ error: 'Must be a valid email'};
  }

  return true;
}

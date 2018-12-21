/*
  Multi-language / internationalization support

 Generic translation resources: https://www.microsoft.com/en-us/language/Search
 https://www.reactnative.guide/13-internationalization/13.1-framework-intro.html
 */

import ReactNative from 'react-native';
import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

import en from './en.json';

// Initialize some stuff
i18n.fallbacks = true; // If an English translation is not available in en.js, it will look inside hi.js
i18n.missingBehaviour = 'guess'; // It will convert HOME_noteTitle to "HOME note title" if the value of HOME_noteTitle doesn't exist in any of the translation files.
i18n.defaultLocale = 'en'; // If the current locale in device is not en or hi
i18n.locale = 'en'; // If we do not want the framework to use the phone's locale by default
// i18n.locale = RNLanguages.language;
i18n.translations = { en };

/*
Listen for device-level language changes and prompt

componentWillMount() {
  RNLanguages.addEventListener('change', this._onLanguagesChange);
}

componentWillUnmount() {
  RNLanguages.removeEventListener('change', this._onLanguagesChange);
}

Or by hooking into react-navigation screens:

// translateHeaderText:
// screenProps => coming from react-navigation (defined in app.container.js)
// langKey => will be passed from the routes file depending on the screen.(We will explain the usage later int the coming topics)
//
// https://www.reactnative.guide/13-internationalization/13.2-language-toggle.html

via root component: <AppNavigator screenProps={{language}} />

or via method:  export const translateHeaderText = (langKey) => ({screenProps}) => {
  const title = I18n.translate(langKey, screenProps.language);
  return {title};
};
*/

export const setLocale = locale => {
  i18n.locale = locale;
};

export const getCurrentLocale = () => i18n.locale; // It will be used to define intial language state in reducer.

// // Is it a RTL language?
// export const isRTL = I18n.currentLocale().indexOf('he') === 0 || I18n.currentLocale().indexOf('ar') === 0;
//
// // Allow RTL alignment in RTL languages
// ReactNative.I18nManager.allowRTL(isRTL);

/*
  The translation method!
  - simplifying the translation util to save characters

  To use:
  import { t } from './i18n';
  <Text>{t('title')}</Text>
  <Text>{t('login.title')}</Text>  // or nested json
  <Text>{t('current', { language: 'en' })}</Text>
 */
export const t = (key, params = {}) => i18n.translate(key, params);

/*
Handle language changes
export const changeLanguage = (language) => {
  // console.log('lang change', language)
  // this.setState({ currentLanguage: language });
  i18n.locale = language;
};

<Button title="cn" onPress={() => i18n.changeLanguage('cn')} />
*/

export default i18n;

import Reactotron, {
  trackGlobalErrors,
  openInEditor,
  overlay,
  asyncStorage,
  networking,
} from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

const instance = Reactotron.configure({
  name: 'React Native Demo',
})
  .useReactNative() // add all built-in react native plugins
  .use(trackGlobalErrors())
  .use(openInEditor())
  .use(overlay())
  .use(asyncStorage())
  .use(networking())
  .use(sagaPlugin())
  .use(reactotronRedux())
  .connect();

console.tron = Reactotron;

export default instance;

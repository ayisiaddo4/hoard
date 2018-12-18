/**
 * KYC router
 */

import { createStackNavigator } from 'react-navigation';

import KYCStatus from './KYCStatus';
import DocumentVerification from './DocumentVerification';
import PersonalInfoReview from './PersonalInfoReview';

import withoutOffscreenRendering from 'hocs/withoutOffscreenRendering';

export const KYCNavigator = createStackNavigator(
  {
    KYCStatus: {
      screen: withoutOffscreenRendering(KYCStatus),
    },
    PersonalInfoReview: {
      screen: withoutOffscreenRendering(PersonalInfoReview),
    },
    DocumentVerification: {
      screen: withoutOffscreenRendering(DocumentVerification),
    },
  },
  {
    initialRouteName: 'KYCStatus',
  }
);

export const KYCRouter = createStackNavigator({
  KYC: {
    screen: withoutOffscreenRendering(KYCNavigator),
  },
});

export default KYCRouter;

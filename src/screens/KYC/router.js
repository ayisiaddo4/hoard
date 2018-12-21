/**
 * KYC router
 */

import { createStackNavigator } from 'react-navigation';

import KYCStatus from './KYCStatus';
import DocumentVerification from './DocumentVerification';
import PersonalInfoReview from './PersonalInfoReview';

export const KYCNavigator = createStackNavigator(
  {
    KYCStatus: {
      screen: KYCStatus,
    },
    PersonalInfoReview: {
      screen: PersonalInfoReview,
    },
    DocumentVerification: {
      screen: DocumentVerification,
    },
  },
  {
    initialRouteName: 'KYCStatus',
  }
);

export const KYCRouter = createStackNavigator({
  KYC: {
    screen: KYCNavigator,
  },
});

export default KYCRouter;

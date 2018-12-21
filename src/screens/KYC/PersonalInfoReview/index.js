import { connect } from 'react-redux';

import PersonalInfoReview from './PersonalInfoReview';

import { infoVerificationConfirmation } from 'screens/KYC/actions';

function mapStateToProps(state) {
  return { kyc: state.kyc };
}

const mapDispatchToProps = {
  infoVerificationConfirmation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalInfoReview);

import { connect } from 'react-redux';

import DocumentVerification from './DocumentVerification';

import { documentVerificationRequest } from 'screens/KYC/actions';

function mapStateToProps(state) {
  return { kyc: state.kyc };
}

const mapDispatchToProps = {
  documentVerificationRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentVerification);

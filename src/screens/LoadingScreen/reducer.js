const initialState = {
  postLoadRedirect: 'Login'
};

export default function LoadingReducer(state = initialState, action) {
  switch (action.type) {
  case "POST_LOAD_REDIRECT": {
    return {postLoadRedirect: action.to};
  }
  default: {
    return state;
  }
  }
}

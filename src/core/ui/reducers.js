import actions from './actions';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_WS:
      return {
        ...state,
        ws: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;

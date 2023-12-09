import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER ='session/removeUser';

//Action Creators
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

//Thunk Action Creators
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  
  const res = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password })
  });

  const data = await res.json();
  dispatch(setUser(data.user));
  
  return res;
};

//Initial State
const initialState = {
  user: null
};

//Reducer
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.payload};

    case REMOVE_USER:
      return {...state, user: null};
    
      default:
      return state;
  }
};

export default sessionReducer;
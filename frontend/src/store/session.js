import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER ='session/removeUser';

//Action Creators
const setUser = (userData) => {
  return {
    type: SET_USER,
    userData
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

//Thunks

//login
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

//logout
export const logout = () => async (dispatch) => {
  const res = await csrfFetch("/api/session", {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeUser());
  }

  return res;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//signup
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password} = user;
  const res = await csrfFetch('/api/users', {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
}

//Initial State
const initialState = {
  user: null
};

//Reducer
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.userData};

    case REMOVE_USER:
      return {...state, user: null};
    
      default:
      return state;
  }
};

export default sessionReducer;
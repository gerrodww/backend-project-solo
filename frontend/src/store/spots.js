import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const fetchSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots));
  }
}

const initialState = {
  spots: []
}

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {

    case LOAD_SPOTS: 
      return {
        ...state,
        spots: action.spots
      }

    default:
      return state;
  }
}

export default spotsReducer;
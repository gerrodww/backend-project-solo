import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const POST_SPOT = 'spots/POST_SPOT'
export const DELETE_SPOT = 'spots/DELETE_SPOT'

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const postSpot = (spotData) => ({
  type: POST_SPOT,
  spotData
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId
})

export const fetchSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots));
  }
}

export const fetchCurrentSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current');

  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots))
  }
}

export const createSpot = (spotData) => async (dispatch) => {
  const { address, city, state, country, name, 
          description, price } = spotData;
  const lat = 90;
  const lng = 90;

  const res = await csrfFetch('/api/spots', {
    method: "POST",
    body: JSON.stringify({address, city, state, country, name, 
      description, price, lat, lng})
  });

  const data = await res.json();
  dispatch(postSpot(data.spotData));
  return data;
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(deleteSpot(spotId));
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

    case POST_SPOT:
      return {
        ...state,
        spotData: action.spotData
      }

    case DELETE_SPOT:
      return {
        ...state,
        spots: state.spots.filter((spot) => spot.id !== action.spotId),
      }

    default:
      return state;
  }
}

export default spotsReducer;
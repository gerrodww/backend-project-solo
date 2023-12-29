import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const POST_SPOT = 'spots/POST_SPOT'
export const DELETE_SPOT = 'spots/DELETE_SPOT'
export const EDIT_SPOT = 'spots/EDIT_SPOT'

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
});

export const editSpot = (spotId) => ({
  type: EDIT_SPOT,
  spotId
})

export const fetchSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots));
  }

  return res
}

export const fetchCurrentSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current');

  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots))
  }

  return res
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
  dispatch(postSpot(spotData));
  return data;
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(deleteSpot(spotId));
  }

  return res
}

export const editSpotThunk = ({spotData, spotId}) => async (dispatch) => {
  const { address, city, state, country, name, 
    description, price } = spotData;
  const lat = 90;
  const lng = 90;

  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    body: JSON.stringify({address, city, state, country, name, 
      description, price, lat, lng})
  })

  if (res.ok) {
    dispatch(editSpot(spotId))
  }

  return res
}

const initialState = {
  spots: {
    spots: []
  }
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
        spots: action.spotData
      }

    case DELETE_SPOT:
      return {
        ...state,
        spots: state.spots.filter((spot) => spot.id !== action.spotId),
      }

    case EDIT_SPOT:
      return {
        ...state,
        spots: action.spotData
      }

    default:
      return state;
  }
}

export default spotsReducer;
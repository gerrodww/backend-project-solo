import { csrfFetch } from "./csrf";

export const LOAD_SPOT_DETAILS = 'spotDetails/LOAD_SPOT_DETAILS'

export const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
});

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spotDetails = await res.json();
    dispatch(loadSpotDetails(spotDetails));
  }
}

const initialState = {
  spotDetails: null
};

const spotDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case LOAD_SPOT_DETAILS:
      return {
        ...state,
        spotDetails: action.spotDetails
      }

    default:
      return state;
  }
}

export default spotDetailsReducer;
import { csrfFetch } from "./csrf";

const POST_SPOT_IMAGE = 'images/POST_SPOT_IMAGE';

const postSpotImage = (data) => {
  return {
    type: POST_SPOT_IMAGE,
    data
  }
};

export const spotImageThunk = ({url, spotId}) => async (dispatch) => {
  const preview = true;
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({url, preview})
  });

  const data = await res.json();
  dispatch(postSpotImage(data.url))
  // dispatch(postSpotImage(data))

  return data;
};

const initialState = {
  images: null
}

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_SPOT_IMAGE:
      return {
        ...state,
        images: action.data
      }
    
    default:
      return state;
  }
}

export default imageReducer;
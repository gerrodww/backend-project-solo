import { csrfFetch } from "./csrf";

const POST_SPOT_IMAGE = 'images/POST_SPOT_IMAGE';

const postSpotImage = (data) => {
  return {
    type: POST_SPOT_IMAGE,
    data
  }
};

export const spotImageThunk = ({url, spotId}) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({url, spotId})
  });

  const data = await res.json();
  dispatch(postSpotImage(data))

  return res;
};

const initialState = {
  images: null
}

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_SPOT_IMAGE:
      return {
        ...state,
        data: action.data
      }
    
    default:
      return state;
  }
}

export default imageReducer;
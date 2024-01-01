import { csrfFetch } from "./csrf";

export const LOAD_SPOT_DETAILS = 'spotDetails/LOAD_SPOT_DETAILS'
export const LOAD_SPOT_REVIEWS = 'spotDetails/LOAD_SPOT_REVIEWS'
export const POST_SPOT_REVIEW = 'spotDetails/POST_SPOT_REVIEW'
export const DELETE_SPOT_REVIEW = 'spotDetails/DELETE_SPOT_REVIEW'

export const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
});

export const loadSpotReviews = (spotReviews) => ({
  type: LOAD_SPOT_REVIEWS,
  spotReviews
});

export const postSpotReview = (review) => ({
  type: POST_SPOT_REVIEW,
  review
});

export const deleteSpotReview = (reviewId) => ({
  type: DELETE_SPOT_REVIEW,
  reviewId
})

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spotDetails = await res.json();
    dispatch(loadSpotDetails(spotDetails));
  }

  return res
}

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const spotReviews = await res.json();
    dispatch(loadSpotReviews(spotReviews));
  }

  return res
}

export const postReviewThunk = ({ review, stars, spotId }) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({review, stars})
  });

  const data = await res.json();
  const reviewData = { review, stars}
  dispatch(postSpotReview(reviewData))
  dispatch(fetchSpotDetails(spotId))
  return data;
}

export const deleteReviewThunk = ({reviewId, spotId}) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    await dispatch(deleteSpotReview(reviewId))
    dispatch(fetchSpotReviews(spotId))
  }

  return res
}

const initialState = {
  spotDetails: null,
  spotReviews: []
};

const spotDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case LOAD_SPOT_DETAILS:
      return {
        ...state,
        spotDetails: action.spotDetails
      }

    case LOAD_SPOT_REVIEWS:
      return {
        ...state,
        spotReviews: action.spotReviews
      }

    case POST_SPOT_REVIEW:
      return {
        ...state,
        spotReviews: action.review
      }

    case DELETE_SPOT_REVIEW:
      return {
        ...state,
        spotReviews: state.spotDetails && state.spotDetails.spotReviews
        ? state.spotDetails.spotReviews.Reviews.filter((review) => review.id !== action.reviewId)
        : state.spotReviews
      }

    default:
      return state;
  }
}

export default spotDetailsReducer;
import { useState } from "react";
import { useDispatch } from "react-redux";
import { postReviewThunk } from "../../store/spotDetails";

function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5); //example stars

  const handleSubmit = (e) => {
    e.preventDefault();
    return dispatch(
      postReviewThunk({review, stars, spotId})
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label> Review
          <input 
          type="text"
          placeholder="Describe your stay"
          onChange={(e) => setReview(e.target.value)}
          required
          />
        </label>
        <button type="submit">Submit Review</button>
      </form>
    </>
  )
}

export default ReviewModal;
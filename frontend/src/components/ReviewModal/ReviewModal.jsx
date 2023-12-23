import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpotReviews, postReviewThunk } from "../../store/spotDetails";
import { useModal } from "../../context/Modal";

function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5); //example stars

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postReviewThunk({review, stars, spotId}))
    closeModal();
  }

  useEffect (() => {
    dispatch(fetchSpotReviews(spotId))
  }, [dispatch, review, spotId])

  return (
    <>
      <form>
        <label> Review
          <input 
          type="text"
          placeholder="Describe your stay"
          onChange={(e) => setReview(e.target.value)}
          required
          />
          <div className="stars">
            <i className="fa-solid fa-star"/>
            <i className="fa-solid fa-star"/>
            <i className="fa-solid fa-star"/>
            <i className="fa-solid fa-star"/>
            <i className="fa-solid fa-star"/>
          </div>
        </label>
        <button type="button" onClick={handleSubmit}>Submit Review</button>
      </form>
    </>
  )
}

export default ReviewModal;
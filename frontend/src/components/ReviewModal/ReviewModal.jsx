import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpotReviews, postReviewThunk } from "../../store/spotDetails";
import { useModal } from "../../context/Modal";
import './ReviewModal.css'

function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(null);

  const handleStarClick = (starId) => {
    setStars(starId);
  };

  const handleSubmit = () => {
    dispatch(postReviewThunk({review, stars, spotId}))
    dispatch(fetchSpotReviews(spotId))
    closeModal();
  }

  const buttonDisabled = () => review.length < 10 || stars === null;

  useEffect (() => {
    dispatch(fetchSpotReviews(spotId))
  }, [dispatch, spotId])

  return (
    <>
      <div className="review-modal">
        <div className="title-div">
          <h2>How was your stay?</h2>
        </div>
          <textarea 
          type="text"
          placeholder="Leave your review here..."
          onChange={(e) => setReview(e.target.value)}
          required
          />

          <div className="stars">
          <i
            className={`fa-solid fa-star ${stars >= 1 ? "post-click" : "pre-click"}`}
            id="1"
            onClick={() => handleStarClick(1)}
          />
          <i
            className={`fa-solid fa-star ${stars >= 2 ? "post-click" : "pre-click"}`}
            id="2"
            onClick={() => handleStarClick(2)}
          />
          <i
            className={`fa-solid fa-star ${stars >= 3 ? "post-click" : "pre-click"}`}
            id="3"
            onClick={() => handleStarClick(3)}
          />
          <i
            className={`fa-solid fa-star ${stars >= 4 ? "post-click" : "pre-click"}`}
            id="4"
            onClick={() => handleStarClick(4)}
          />
          <i
            className={`fa-solid fa-star ${stars === 5 ? "post-click" : "pre-click"}`}
            id="5"
            onClick={() => handleStarClick(5)}
          />
          <p>Stars</p>
        </div>

        <button type="button" onClick={handleSubmit} disabled={buttonDisabled()}>Submit Your Review</button>
      </div>
    </>
  )
}

export default ReviewModal;
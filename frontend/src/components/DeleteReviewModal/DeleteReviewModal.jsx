import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/spotDetails"; 
import './DeleteReviewModal.css'

function DeleteReviewModal({reviewId, spotId}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  function yesClick(reviewId, e) {
    e.preventDefault();
    return dispatch(deleteReviewThunk({reviewId, spotId}))
      .then(closeModal)
  }

  return (
    <>
      <div>
        <h2>Confirm delete</h2>
        <label> Are you sure you want to delete this review?
          <div>
            <button onClick={(e) => yesClick(reviewId, e)}>Yes (delete review)</button>
            <button onClick={closeModal}>No (keep review)</button>
          </div>
        </label>
      </div>
    </>
  )
}

export default DeleteReviewModal;
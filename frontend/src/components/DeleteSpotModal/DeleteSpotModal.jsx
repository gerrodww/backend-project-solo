import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import './DeleteSpotModal.css'

function DeleteSpotModal({spotId}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  function yesClick(spotId) {
    dispatch(deleteSpotThunk(spotId))
  }

  return (
    <>
      <form>
        <label className="delete-modal"> Are you sure you want to remove this spot?</label>
        <div className="buttons">
          <button className="yes-delete" onClick={() => yesClick(spotId)}>Yes</button>
          <button className="no-delete" onClick={closeModal}>No</button>
        </div>
        </form>
    </>
  )
}

export default DeleteSpotModal;
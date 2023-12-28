import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
import './ManageSpots.css'

function ManageSpots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentSpots());
  }, [dispatch])

  function goToSpot(spotId) {
    navigate(`/spots/${spotId}`);
  }
  
  function goToSpotEdit(spotId) {
    navigate(`/spots/${spotId}/edit`);
  }

  if (!spots) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <div className="current-spots-list">
      <h1>Manage Spots</h1>
      {spots.Spots &&
        spots.Spots.map((spot) => (
          <>
          <div className="spot-tile-manage" key={spot.id} 
            onClick={() => goToSpot(spot.id)} title={spot.name}>
            <div className="spot-image"> <img src={spot.previewImage} alt={spot.name} /> </div>
            <div className="spot-details">
              <div className="city-state">
                {spot.city}, {spot.state}
              </div>
              <div className="star-rating">Rating: {spot.avgRating.toFixed(2)}</div>
            </div>
              <div className="price-per-night">${spot.price} night </div>
                </div>
              <div className="update-delete">
          <OpenModalButton 
          modalComponent={<DeleteSpotModal spotId={spot.id}/>}
          buttonText='Delete'
          />
          <button onClick={() => goToSpotEdit(spot.id)}>Update</button>
          </div>
          </>
        ))}
    </div>
  )
}

export default ManageSpots;
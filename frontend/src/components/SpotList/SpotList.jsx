import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import './SpotList.css';

function SpotList() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  function goToSpot(spotId) {
    navigate(`/spots/${spotId}`);
  }

  return (
    <div className="spot-list">
      {spots.Spots &&
        spots.Spots.map((spot) => (
          <div className="spot-tile" key={spot.id} 
              onClick={() => goToSpot(spot.id)} title={spot.name}>
            <div className="spot-image"> <img src={spot.previewImage} alt={spot.name} /> </div>
            <div className="spot-details">
              <div className="city-state">
                {spot.city}, {spot.state}
              </div>
              {spot.avgRating ? (
              <div className="star-rating">Rating: {spot.avgRating.toFixed(2)}</div>
            ) : (
              <div className="new-star"> < i className="fa-solid fa-star"/>  New</div>
            )}
            </div>
              <div className="price-per-night">${spot.price} night</div>
          </div>
        ))}
    </div>
  )
}

export default SpotList;
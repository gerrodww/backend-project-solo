import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import './SpotList.css';

function SpotList() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots)

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch])

  return (
    <div className="spot-list">
      {spots.Spots &&
        spots.Spots.map((spot) => (
          <div className="spot-tile" key={spot.id}>
            <div className="spot-image"> <img src={spot.previewImage} alt={spot.name} /> </div>
            <div className="spot-details">
              <div className="city-state">
                {spot.city}, {spot.state}
              </div>
              <div className="star-rating">Rating: {spot.avgRating}</div>
            </div>
              <div className="price-per-night">${spot.price} night</div>
          </div>
        ))}
    </div>
  )
}

export default SpotList;
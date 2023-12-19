import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spotDetails";

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spotDetails.spotDetails);
  const parsedId = parseInt(spotId, 10);

  const { name, description, SpotImages, Owner, city, state, country, 
          price, avgStarRating, numReviews } = spotDetails;

  useEffect(() => {
    dispatch(fetchSpotDetails(parsedId));
  }, [dispatch, spotId]);

  function reserveClick() {
    window.alert('Feature coming soon!');
  }

  if (!spotDetails) {
    return <h1>Loading spot...</h1>
  }

  return (
    <>
    <section className="overview">
      <h1>{name}</h1>
      <div className="main-image">
        <img src={SpotImages[0].url} alt={name} />
      </div>
      <div className="additional-images">
        {SpotImages.slice(1, 5).map((image) => (
          <img key={image.id} src={image.url} alt={name} />
        ))}
      </div>
      <p>Location: {city}, {state}, {country}</p>
      <p>Hosted by: {Owner.firstName} {Owner.lastName}</p>
      <p>{description}</p>
      <div className="details-callout">
        <p>${price} per night</p>
        <button onClick={reserveClick}>Reserve</button>
        <div>
        <i className="fa-solid fa-star" />
          {avgStarRating.toFixed(2)}
        </div>
        <div className="reviews">
          {numReviews === 1 ? `${numReviews} Review` : `${numReviews} Reviews`}
        </div>

      </div>
      </section>
      <section className="reviews">

      </section>
    </>
  )
}

export default SpotDetails;
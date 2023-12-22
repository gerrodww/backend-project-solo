import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails, fetchSpotReviews } from "../../store/spotDetails";
import OpenModalButton from "../OpenModalButton";
import ReviewModal from "../ReviewModal";

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spotDetails.spotDetails);
  const spotReviews = useSelector((state) => state.spotDetails.spotReviews);
  const parsedId = parseInt(spotId, 10);

  useEffect(() => {
    dispatch(fetchSpotDetails(parsedId));
    dispatch(fetchSpotReviews(parsedId));
  }, [dispatch, parsedId]);

  function reserveClick() {
    window.alert('Feature coming soon!');
  }

  function formatMonthYear(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', {month: 'long'});
    const year = date.getFullYear();
    return `${month} ${year}`
  }

  if (!spotDetails) {
    return <h1>Loading spot...</h1>
  }

  return (
    <>
    <section className="overview">
      <h1>{spotDetails.name}</h1>
      <div className="main-image">
          <img src={spotDetails.SpotImages[0].url} alt={spotDetails.SpotImages.name} />
        </div>
        {spotDetails.SpotImages.length > 1 && (
          <div className="additional-images">
            {spotDetails.SpotImages.slice(1, 5).map((image) => (
              <img key={image.id} src={image.url} alt={name} />
            ))}
          </div>
        )}
      <p>Location: {spotDetails.city}, {spotDetails.state}, {spotDetails.country}</p>
      <p>Hosted by: {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</p>
      <p>{spotDetails.description}</p>
      <div className="details-callout">
        <p>${spotDetails.price} per night</p>
        <button onClick={reserveClick}>Reserve</button>
        <div>
        <i className="fa-solid fa-star" />
          {spotDetails.avgStarRating.toFixed(2)}
        </div>
        <div className="reviews">
          {spotDetails.numReviews === 1 ? `${spotDetails.numReviews} Review` : `${spotDetails.numReviews} Reviews`}
        </div>
      </div>
      </section>

      <section className="reviews">
        <div>
          <OpenModalButton 
            modalComponent={<ReviewModal spotId={parsedId}/>}
            buttonText="Post Your Review"
          />
        </div>
  {spotReviews.Reviews.map((review, index) => (
    <div key={index}>
      <p>{review.review}</p>
      <p>created by {review.User.firstName} {formatMonthYear(review.createdAt)}</p>
    </div>
  ))}
</section>
    </>
  )
}

export default SpotDetails;
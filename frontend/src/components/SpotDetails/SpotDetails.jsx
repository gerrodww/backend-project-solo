import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails, fetchSpotReviews } from "../../store/spotDetails";
import OpenModalButton from "../OpenModalButton";
import ReviewModal from "../ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";
import './SpotDetails.css';

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spotDetails.spotDetails);
  const spotReviews = useSelector((state) => state.spotDetails.spotReviews);
  const sessionUser = useSelector((state) => state.session.user)
  const parsedId = parseInt(spotId, 10);

  useEffect(() => {
    dispatch(fetchSpotDetails(parsedId));
    dispatch(fetchSpotReviews(parsedId));
  }, [dispatch, parsedId]);

  function reserveClick() {
    window.alert('Feature coming soon!');
  }

  function refreshContent() {
    dispatch(fetchSpotDetails(parsedId))
    dispatch(fetchSpotReviews(parsedId))
  }

  function formatMonthYear(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', {month: 'long'});
    const year = date.getFullYear();
    return `${month} ${year}`
  }

  if (!spotDetails || !spotReviews) {
    return <h1>Loading spot...</h1>
  }

  const reviewArr = spotReviews.Reviews;
  let alreadyReviewed = false;
  let areOwner = false;
  
  if (reviewArr && sessionUser) {
    alreadyReviewed = reviewArr.find((review) => review.User.id === sessionUser.id)
    areOwner = sessionUser.id === spotDetails.ownerId;
  }

  function yourReview(id) {
    if (sessionUser && sessionUser.id === id) return true
  }

  return (
    <>
    <div className="spot-details-all">
    <section className="overview">
      <div>
      <h2>{spotDetails.name}</h2>
      <p>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</p>
      </div>
        <div className="image-container">
  {spotDetails.SpotImages.length === 1 ? (
    <div className="solo-image">
      <img src={spotDetails.SpotImages[0].url} alt={spotDetails.SpotImages[0].name} />
    </div>
  ) : (
    <>
      <div className="main-image">
        <img src={spotDetails.SpotImages[0].url} alt={spotDetails.SpotImages[0].name} />
      </div>
      {spotDetails.SpotImages.length > 1 && (
        <div className="additional-images">
          {spotDetails.SpotImages.slice(1, 5).map((image) => (
            <img key={image.id} src={image.url} alt={name} />
          ))}
        </div>
      )}
    </>
  )}
</div>
      <div className="details-callout">
        <div className="description">
      <p>Hosted by: {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</p>
      <p>{spotDetails.description}</p>
      </div>
        <div className="reserve-box">
          <div className="ppn-rating">
        <p className="ppn">${spotDetails.price} per night</p>
        <div className="num-star">
        {spotDetails.numReviews > 0 ? (
          <>
            <div>
              <i className="fa-solid fa-star" />
              {spotDetails.avgStarRating.toFixed(2)}
            </div>
            <div>
              <span className="separator"> &middot; </span>
              {spotDetails.numReviews === 1
                ? `${spotDetails.numReviews} Review`
                : `${spotDetails.numReviews} Reviews`}
            </div>
          </>
            ) : (
              <div>
                <i className="fa-solid fa-star" />
                New
              </div>
            )}
          </div>
          </div>
        <button className="reserve-button" onClick={reserveClick}>Reserve</button>
        </div>
      </div>
      </section>

      <section className="reviews">
        <div className="review-details2">
          {spotDetails.numReviews > 0 ? (
            <>
              <i className="fa-solid fa-star r2" />
              {spotDetails.avgStarRating.toFixed(2)}
              <span className="separator"> &middot; </span>
              {spotDetails.numReviews === 1
                ? `${spotDetails.numReviews} Review`
                : `${spotDetails.numReviews} Reviews`}
            </>
          ) : (
            <>
              <i className="fa-solid fa-star r2" />
              New
            </>
          )}
        </div>
        {sessionUser && !areOwner && !alreadyReviewed && (
        <div className="review-modal-button">
          <OpenModalButton 
            modalComponent={<ReviewModal spotId={parsedId}/>}
            buttonText="Post Your Review"
            onModalClose={() => refreshContent}
          />
        </div>)}
        {sessionUser && !areOwner && spotReviews.Reviews === null && (
          <h2>Be the first to post a review!</h2>
        )}
  {spotReviews.Reviews && spotReviews.Reviews.map((review) => (
    <div key={Number(review.id)}>
      <p>{review.review}</p>
      <p>created by {review.User.firstName} {formatMonthYear(review.createdAt)}</p>
      {yourReview(review.User.id) &&
      <div className="delete-review-button">
        <OpenModalButton 
          modalComponent={<DeleteReviewModal reviewId={review.id} spotId={parsedId}/>}
          buttonText="Delete"
          onModalClose={() => refreshContent}
        />
      </div>
      }
    </div>
  ))}
</section>
</div>
    </>
  )
}

export default SpotDetails;
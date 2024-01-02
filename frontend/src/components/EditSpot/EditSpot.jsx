import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spotDetails";
import { editSpotThunk } from "../../store/spots";

function EditSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spotDetails.spotDetails);
  const parsedId = parseInt(spotId, 10);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('')
  // const [url, setUrl] = useState('')
  // const [url2, setUrl2] = useState('')
  // const [url3, setUrl3] = useState('')
  // const [url4, setUrl4] = useState('')
  // const [url5, setUrl5] = useState('')

  useEffect(() => {
    dispatch(fetchSpotDetails(parsedId))
  }, [dispatch, parsedId])

  useEffect(() => {
    
    if (spotDetails) {
    setAddress(spotDetails.address)
    setCity(spotDetails.city)
    setState(spotDetails.state)
    setCountry(spotDetails.country)
    setName(spotDetails.name)
    setDescription(spotDetails.description)
    setPrice(spotDetails.price)
    // setUrl(spotDetails.SpotImages[0].url)

    // if (spotDetails.SpotImages.length > 1) {
    //   setUrl2(spotDetails.SpotImages[1].url)
    // }

    // if (spotDetails.SpotImages.length > 2) {
    //   setUrl3(spotDetails.SpotImages[2].url)
    // }

    // if (spotDetails.SpotImages.length > 3) {
    //   setUrl4(spotDetails.SpotImages[3].url)
    // }

    // if (spotDetails.SpotImages.length > 4) {
    //   setUrl5(spotDetails.SpotImages[4].url)
    // }
    }
  }, [spotDetails])

  function goToSpot(spotId) {
    navigate(`/spots/${spotId}`);
  }

  const handleSubmit = async () => {

    const spotData = {
      address,
      city,
      state,
      country,
      name,
      description,
      price
    }

    dispatch(editSpotThunk({spotData, spotId: parsedId}))
    goToSpot(parsedId);
  }

  return (
    <>
      <h1 className="heading-title">Update your Spot</h1>

      <div className='new-spot-form'>
      <div className="section-1-title">
        <h2 className="subtitle">Where&apos;s your place located?</h2>
        <p>Guests will only get your exact address once they&apos;ve have booked a reservation</p>
      </div>
        <div className="section-1">
        <label>Country
          <input 
            type="text" value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            required
          />
        </label>

        <label>Street Address
          <input 
            type="text" value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
          />
        </label>

        <label>City
          <input 
            type="text" value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            required
          />
        </label>

        <label>State
          <input 
            type="text" value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            required
          />
        </label>
        </div>

        <div className="section-1-title">
          <h2 className="subtitle">Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        </div>
        <div className="section-1">
        <label>
          <textarea 
            type="text" value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            required
          />
        </label>
        </div>
        
        <div className="section-1-title">
          <h2 className="subtitle">Create a title for your spot</h2>
          <p>Catch guests&apos; attention with a spot title that highlights what makes your place special</p>
        </div>
        <div className="section-1">
        <label>
          <input 
            type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name your spot"
            required
          />
        </label>
        </div>

        <div className="section-1-title">
          <h2 className="subtitle">Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        </div>

        <div className="section-2">
        <label>
          <input 
            type="number" value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            required
          />
        </label>
        </div>

        {/* <div className="section-1">
        <input type="text" id="image" name="image" 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Preview Image"></input>
        <input type="text" id="image-2" name="image"
        onChange={(e) => setUrl2(e.target.value)}
        placeholder="Image URL"></input>
        <input type="text" id="image-3" name="image"
        onChange={(e) => setUrl3(e.target.value)}
        placeholder="Image URL"></input>
        <input type="text" id="image-4" name="image"
        onChange={(e) => setUrl4(e.target.value)}
        placeholder="Image URL"></input>
        <input type="text" id="image-5" name="image"
        onChange={(e) => setUrl5(e.target.value)}
        placeholder="Image URL"></input>
        </div> */}

        <button className="submit-spot" onClick={handleSubmit}>Update your Spot</button>
      </div>
    </>
  )
}

export default EditSpot;
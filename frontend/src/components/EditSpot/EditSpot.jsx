import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spotDetails";

function EditSpot() {
  const dispatch = useDispatch();
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
  const [url, setUrl] = useState('')
  const [url2, setUrl2] = useState('')
  const [url3, setUrl3] = useState('')
  const [url4, setUrl4] = useState('')
  const [url5, setUrl5] = useState('')

  useEffect(() => {
    dispatch(fetchSpotDetails(parsedId))
    setAddress(spotDetails.address)
    setCity(spotDetails.city)
    setState(spotDetails.state)
    setCountry(spotDetails.country)
    setName(spotDetails.name)
    setDescription(spotDetails.description)
    setPrice(spotDetails.price)
    setUrl(spotDetails.SpotImages[0].url)

    if (spotDetails.SpotImages.length > 1) {
      setUrl2(spotDetails.SpotImages[1].url)
    }

    if (spotDetails.SpotImages.length > 2) {
      setUrl3(spotDetails.SpotImages[2].url)
    }

    if (spotDetails.SpotImages.length > 3) {
      setUrl4(spotDetails.SpotImages[3].url)
    }

    if (spotDetails.SpotImages.length > 4) {
      setUrl5(spotDetails.SpotImages[4].url)
    }

  }, [dispatch, parsedId])

  console.log(spotDetails, "spotdetails *****");

  

  return (
    <>
      <div>
        <h1>Editing spot at</h1>
        <h2>Where&apos;s your place located?</h2>
        <p>Guests will only get your exact address once they&apos;ve have booked a reservation</p>
      </div>

      <form>
        <div>
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

        <div>
        <label>Description
          <input 
            type="text" value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your scary spot"
            required
          />
        </label>
        </div>
        
        <div>
        <label>Title
          <input 
            type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Give your spooky spot a title"
            required
          />
        </label>
        </div>

        <div>
        <label>Price per night
          <input 
            type="text" value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            required
          />
        </label>
        </div>

        <label>images</label>
        <input type="text" name="image" value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Preview Image"></input>
        <input type="text" name="image" value={url2}
        onChange={(e) => setUrl2(e.target.value)}
        ></input>
        <input type="text" name="image" value={url3}
        onChange={(e) => setUrl3(e.target.value)}
        ></input>
        <input type="text" name="image" value={url4}
        onChange={(e) => setUrl4(e.target.value)}
        ></input>
        <input type="text" name="image" value={url5}
        onChange={(e) => setUrl5(e.target.value)}
        ></input>

        <button type="submit">Edit spot</button>
      </form>
    </>
  )
}

export default EditSpot;
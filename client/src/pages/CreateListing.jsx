import React, { useState, useContext } from "react";
import { useMutation, gql } from "@apollo/client";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CREATE_LISTING = gql`
mutation AddListing($user_id: Int!, $image_url: String!, $name: String!, $description: String!, $address: String!, $price: Int!){
  addListing(user_id: $user_id, image_url: $image_url, name: $name, description: $description, address: $address, price: $price) {
    id
  }
}
`

const CreateListing = () => {
  const {
    user,
  } = useContext(authContext);

  const [formState, setFormState] = useState({});
  const [addressState, setAddressState] = useState({});
  const [listingCreated, setListingCreated] = useState(false);

  const navigate = useNavigate()

  const [addListing, addedListing] = useMutation(CREATE_LISTING);

  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  }

  const handleAddressChange = (event) => {
    setAddressState({...addressState, [event.target.name]: event.target.value})
  }

  const onSubmit = (event) => {
    event.preventDefault();

    const address = `${addressState.street}, ${addressState.city}, ${addressState.postalCode}`;

    addListing({
      variables: {
        user_id: user.id, image_url: formState.imageUrl, name: formState.name, description: formState.description, address: address, price: Number(formState.price)
      }
    }).then(() => {
      setListingCreated(true)
    }).catch((err) => {
      console.log(err.message);
    })
  }

  const navigateToViewListings = () => {
    navigate('/viewListings')
  }

  return(
    <div className="d-flex justify-content-center py-5 mx-2">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-6 text-center">
      <div className="card-header bg-dark">
          <h2 className="text-light">Create Listing</h2>
        </div>
        {listingCreated ? 
        <div className="card-body">
          <div className="border rounded bg-light py-3 mb-3">
            <h4 className="mb-3">Listing Successfully Created</h4>
            <h5>{formState.name}</h5>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-dark" onClick={navigateToViewListings}>Return To My Listings</button>
          </div>
        </div>
        :
        <form className="px-3" onSubmit={onSubmit}>
          <div className="form-group pt-4">
            <label className="form-label">Name</label>
            <input className="form-control" type="text" placeholder="Name" name="name" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Description</label>
            <textarea className="form-control" type="text" placeholder="Description" name="description" required onChange={(e) => handleChange(e)}></textarea>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Image URL</label>
            <input className="form-control" type="text" placeholder="URL" name="imageUrl" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Street Address</label>
            <input className="form-control" type="text" placeholder="123 New Street" name="street" required onChange={(e) => handleAddressChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">City</label>
            <input className="form-control" type="text" placeholder="City" name="city" required onChange={(e) => handleAddressChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Postal Code (XXX XXX)</label>
            <input className="form-control" type="text" placeholder="Postal Code" name="postalCode" required onChange={(e) => handleAddressChange(e)} pattern="[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] [0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Price Per Night</label>
            <input className="form-control" type="number" min="0" placeholder="Price Per Night" name="price" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="d-flex justify-content-end mx-2 my-4 gap-2">
            <button className="btn btn-dark" type="submit">Create Listing</button>
            <button className="btn btn-danger" onClick={navigateToViewListings}>Cancel</button>
          </div>
        </form>
        }
      </div>
    </div>
    
  )
}

export default CreateListing;
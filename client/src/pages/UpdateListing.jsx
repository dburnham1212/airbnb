import React, { useState, useContext, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const GET_LISTING = gql`
  query GetListing($id: Int!){
    listing(id: $id){
      id
      name
      description
      image_url
      address
      price
    }
  }
`;

const UPDATE_LISTING = gql`
mutation UpdateListing($id: Int!, $image_url: String!, $name: String!, $description: String!, $address: String!, $price: Int!){
  updateListing(id: $id, image_url: $image_url, name: $name, description: $description, address: $address, price: $price) {
    id
  }
}
`;

const UpdateListing = () => {
  const {
    user,
  } = useContext(authContext);

  
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    imageUrl: "",
    address: "",
    price: ""
  });
  const [addressState, setAddressState] = useState({
    street: "",
    city: "",
    postalCode: ""
  });

  const [listing, setListing] = useState({});

  const [updateListing, updatedListing] = useMutation(UPDATE_LISTING);
  
  const navigate = useNavigate()
  const { listingId } = useParams();

 const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  }

  const handleAddressChange = (event) => {
    setAddressState({...addressState, [event.target.name]: event.target.value})
  }

  const onSubmit = (event) => {
    event.preventDefault();

    const address = `${addressState.street}, ${addressState.city}, ${addressState.postalCode}`;

    updateListing({
      variables: {
        id: listing.id, image_url: formState.imageUrl, name: formState.name, description: formState.description, address: address, price: Number(formState.price)
      }
    }).then(() => {
      navigate('/viewListings')
    }).catch((err) => {
      console.log(err.message);
    })
  }

  // Query to get the listing data via GraphQL
  const { loading, error, data } = useQuery(GET_LISTING, {
    variables: { id: Number(listingId) }
  });

  useEffect(() => {  
    // Create a variable for listing and set it to the data recieved
    if(!loading){
      const listing = data.listing;

      setListing(listing);

      const addressString = listing.address.split(",");
      setAddressState({
        street: addressString[0],
        city: addressString[1].trim(),
        postalCode: addressString[2].trim()
      })
      
      setFormState({
        name: listing.name,
        description: listing.description,
        imageUrl: listing.image_url,
        price: listing.price
      })
    }
  }, [loading])

  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return(
    <div className="d-flex justify-content-center py-5 mx-2">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-6 text-center">
      <div className="card-header">
          <h2>Update Listing</h2>
        </div>
        <form className="px-3" onSubmit={onSubmit}>
          <div className="form-group pt-4">
            <label className="form-label">Name</label>
            <input className="form-control" type="text" placeholder="Name" name="name" value={formState.name} required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Description</label>
            <textarea className="form-control" type="text" placeholder="Description" name="description" value={formState.description} required onChange={(e) => handleChange(e)}></textarea>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Image URL</label>
            <input className="form-control" type="text" placeholder="Description" name="imageUrl" value={formState.imageUrl} required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Street Address</label>
            <input className="form-control" type="text" placeholder="123 New Street" name="street" value={addressState.street} required onChange={(e) => handleAddressChange(e)} pattern="^[^,]+$"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">City</label>
            <input className="form-control" type="text" placeholder="City" name="city" required value={addressState.city} onChange={(e) => handleAddressChange(e)} pattern="^[^,]+$"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Postal Code (XXX XXX)</label>
            <input className="form-control" type="text" placeholder="Postal Code" name="postalCode" value={addressState.postalCode} required onChange={(e) => handleAddressChange(e)} pattern="[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] [0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]" ></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Price Per Night</label>
            <input className="form-control" type="number" min="0" placeholder="Price Per Night" name="price" value={formState.price} required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark" type="submit">Update Listing</button>
          </div>
        </form>
      </div>
    </div>
    
  )
}

export default UpdateListing;
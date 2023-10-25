import React, { useState, useContext, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// Get listing GraphQL query
const GET_LISTING = gql`
  query GetListing($id: Int!, $token: String!){
    listing(id: $id, token: $token){
      id
      name
      description
      image_url
      address
      price
    }
  }
`;

// Update listing GraphQL query
const UPDATE_LISTING = gql`
mutation UpdateListing($id: Int!, $image_url: String!, $name: String!, $description: String!, $address: String!, $price: Int!){
  updateListing(id: $id, image_url: $image_url, name: $name, description: $description, address: $address, price: $price) {
    id
  }
}
`;

const UpdateListing = () => {
  // Import user object from context
  const {
    handleJWTErrors
  } = useContext(authContext);

  // State Objects
  const [listing, setListing] = useState({});
  const [listingUpdated, setListingUpdated] = useState(false);
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

  // Use Navigate to handle navigation
  const navigate = useNavigate()

  // Get listingId from params in url
  const { listingId } = useParams();

  // Set up update listing mutation to be used when a listing is updated
  const [updateListing, _updatedListing] = useMutation(UPDATE_LISTING);
  
  // Handle form changes
  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  }

  // Handle changes specifically tied to the address
  const handleAddressChange = (event) => {
    setAddressState({...addressState, [event.target.name]: event.target.value})
  }

  // Function to handle form submission when a listing is updated
  const onSubmit = (event) => {
    event.preventDefault();

    // Concatenate address string to be stored in db
    const address = `${addressState.street}, ${addressState.city}, ${addressState.postalCode}`;

    // Update the listing using form fields as input
    updateListing({
      variables: {
        id: listing.id, image_url: formState.imageUrl, name: formState.name, description: formState.description, address: address, price: Number(formState.price)
      }
    }).then(() => {
      // If successful change listing updated state to true
      setListingUpdated(true);
    }).catch((err) => {
      // If not successful log error message to console
      console.log(err.message);
    })
  }
  
  // Function used to navigate back to my listings page
  const navigateToViewListings = () => {
    navigate('/viewListings')
  }

  // Query to get the listing data via GraphQL
  const { loading, error, data } = useQuery(GET_LISTING, {
    variables: { id: Number(listingId), token: localStorage.getItem("token") }
  });

  // Check if loading has been completed
  useEffect(() => {  
    if(!loading){
      // If we recieve an error
      if(error) {
        // Handle JWT errors
        handleJWTErrors(error);
      } else {
        // Create a variable for listing and set it to the data recieved
        const listing = data.listing;

        // Set listing state object to listing recieved from db
        setListing(listing);

        // Split the address string based off of where the commas are in the string
        const addressString = listing.address.split(",");

        // Trim address strings and set them to appropriate object key value pairs
        setAddressState({
          street: addressString[0],
          city: addressString[1].trim(),
          postalCode: addressString[2].trim()
        })
        
        // Set up the overall form state exluding the adress
        setFormState({
          name: listing.name,
          description: listing.description,
          imageUrl: listing.image_url,
          price: listing.price
        })
      }
    }
  }, [loading])

  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return(
    <div className="d-flex justify-content-center py-5 mx-2">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-6 text-center">
      <div className="card-header bg-dark">
          <h2 className="text-light">Update Listing</h2>
        </div>
        {listingUpdated ? 
        <div className="card-body">
          <div className="border rounded bg-light py-3 mb-3">
            <h4 className="mb-3">Listing Successfully Updated</h4>
            <h5>{formState.name}</h5>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-dark" onClick={navigateToViewListings}>Return To My Listings</button>
          </div>
        </div>
        :
        <form className="px-3 bg-light" onSubmit={onSubmit}>
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
          <div className="d-flex justify-content-end mx-2 my-4 gap-2">
            <button className="btn btn-dark" type="submit">Update Listing</button>
            <button className="btn btn-danger" onClick={navigateToViewListings}>Cancel</button>
          </div>
        </form>}
      </div>
    </div>
    
  )
}

export default UpdateListing;
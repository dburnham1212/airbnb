import React, { useState, useContext } from "react";
import { useMutation, gql } from "@apollo/client";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// GraphQL query used to create a listing
const CREATE_LISTING = gql`
mutation AddListing($user_id: Int!, $image_url: String!, $name: String!, $description: String!, $address: String!, $price: Int!, $token: String!){
  addListing(user_id: $user_id, image_url: $image_url, name: $name, description: $description, address: $address, price: $price, token: $token) {
    id
  }
}
`;

const NewListing = () => {
  // Get the user object from context
  const {
    user,
    handleJWTErrors
  } = useContext(authContext);

  // State objects
  const [formState, setFormState] = useState({});
  const [addressState, setAddressState] = useState({});
  const [listingCreated, setListingCreated] = useState(false);

  // Use Navigate to handle navigation
  const navigate = useNavigate()

  // Mutation used to add a listing to the db to be called when needed
  const [addListing] = useMutation(CREATE_LISTING);

  // Handle changes to the form 
  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  };

  // Handle changes to adress specifically in the form data
  const handleAddressChange = (event) => {
    setAddressState({...addressState, [event.target.name]: event.target.value})
  };

  // On submit function to be called when the form is completed to create a listing
  const onSubmit = (event) => {
    event.preventDefault();

    // Concatenate the address from the inputted fields 
    const address = `${addressState.street.trim()}, ${addressState.city.trim()}, ${addressState.postalCode.trim()}`;

    // Use the mutation to add the listing to the db
    addListing({
      variables: {
        user_id: user.id, 
        image_url: formState.imageUrl, 
        name: formState.name, description: 
        formState.description, 
        address: address, 
        price: Number(formState.price), 
        token: localStorage.getItem("token")
      }
    }).then(() => {
      // If successful set a listing created state to let us know that it was successful
      setListingCreated(true);
    }).catch((err) => {
      // If not successful first handle JWT errors
      handleJWTErrors(err);
      // Otherwise log the error to the console
      console.log(err.message);
    })
  }

  // function to navigate to the my listings page
  const navigateToViewListings = () => {
    navigate('/viewListings');
  }

  return(
    <div className="d-flex justify-content-center py-5 mx-2">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-6 text-center">
      <div className="card-header bg-dark">
          <h2 className="text-light">New Listing</h2>
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
            <input className="form-control" type="text" placeholder="123 New Street" name="street" required onChange={(e) => handleAddressChange(e)} pattern="^[^,]+$"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">City</label>
            <input className="form-control" type="text" placeholder="City" name="city" required onChange={(e) => handleAddressChange(e)} pattern="^[^,]+$"></input>
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

export default NewListing;
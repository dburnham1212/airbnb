import React, { useContext, useState } from "react";
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";

// GraphQL Query to delete a listing
const DELETE_LISTING = gql`
mutation DeleteListing($id: Int!, $token: String!){
  deleteListing(id: $id, token: $token) {
    id
  }
}
`

const ListingCard = (props) => {
  const {
    handleJWTErrors 
  } = useContext(authContext);
  // State objects
  const [inDeleteMode, setInDeleteMode] = useState(false);
  
  // Use Navigate to handle navigation
  const navigate = useNavigate();

  // Mutation to delete a listing from the db
  const [deleteListing, _deletedListing] = useMutation(DELETE_LISTING);
  
  // Function to delete a listing from the db
  const onDelete = () => {
    deleteListing({
      variables: {
        id: props.id,
        token: localStorage.getItem("token")
      }
    }).then(() => {
      props.removeListing(props.id);
    }).catch((err) => {
      handleJWTErrors(err)
    })
  };

  // Function to navigate to view listing page
  const navigateToListing = () => {
    navigate(`/viewListing/${props.id}`)
  }

  // Function to navigate to update listing page
  const navigateToUpdateListing = () => {
    navigate(`/updateListing/${props.id}`)
  }

  return(
    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mt-4">
      <div className="card bg-light p-3">
        <img className="object-fit-cover border rounded" src={props.image_url} alt="listing image" height="300" />
        <div className="my-3 border rounded">
          <h5 className="border-bottom border-dark mx-3 py-2 text-uppercase">{props.name}</h5>
          <p>{props.description}</p>
          <p>Address: {props.address}</p>
          <div className="border-top w-100 py-2 fw-bold"> ${props.price} CAD per night</div>
        </div>
        <div className="d-flex justify-content-end align-items-center gap-2">
          {!inDeleteMode && <button className="btn btn-secondary" onClick={navigateToListing}>View</button>}
          {props.canEdit && <>
            {inDeleteMode ?
            <>
              <span>Confirm Delete:</span>
              <button className="btn btn-danger" onClick={onDelete}>Yes</button>
              <button className="btn btn-dark" onClick={() => setInDeleteMode(false)}>No</button>
            </>
            :
            <>
              <button className="btn btn-dark" onClick={navigateToUpdateListing}>Update</button>
              <button className="btn btn-danger" onClick={() => setInDeleteMode(true)}>Delete</button>
            </>
            }
          </>}
        </div>
      </div>
    </div>
  )
}

export default ListingCard;
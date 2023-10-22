import React from "react";
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";


const DELETE_LISTING = gql`
mutation DeleteListing($id: Int!){
  deleteListing(id: $id) {
    id
  }
}
`

const ListingCard = (props) => {
  const navigate = useNavigate();
  
  const [deleteListing, deletedListing] = useMutation(DELETE_LISTING);
  
  // Function to delete a listing
  const onDelete = () => {
    deleteListing({
      variables: {
        id: props.id
      }
    })
    props.removeListing(props.id);
  }

  const navigateToListing = () => {
    navigate(`/viewListing/${props.id}`)
  }

  const navigateToUpdateListing = () => {
    navigate(`/updateListing/${props.id}`)
  }

  return(
    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mt-4">
      <div className="card bg-light p-3">
        <h6>{props.name}</h6>
        <p>{props.description}</p>
        <p>{props.address}</p>
        <p>${props.price}CAD per night</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={navigateToListing}>View Listing</button>
          {props.canEdit && <>
            <button className="btn btn-dark" onClick={navigateToUpdateListing}>Update Listing</button>
            <button className="btn btn-danger" onClick={onDelete}>Delete Listing</button>
          </>}
        </div>
      </div>
    </div>
  )
}

export default ListingCard;
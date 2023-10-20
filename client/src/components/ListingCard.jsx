import React from "react";
import { useMutation, gql } from '@apollo/client';
const DELETE_LISTING = gql`
mutation DeleteListing($id: Int!){
  deleteListing(id: $id) {
    id
  }
}
`


const ListingCard = (props) => {
  const [deleteListing, deletedListing] = useMutation(DELETE_LISTING);
  
  const onDelete = () => {
    deleteListing({
      variables: {
        id: props.id
      }
    })
  }

  return(
    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mt-4">
      <div className="card bg-light p-3">
        <h6>{props.name}</h6>
        <p>{props.description}</p>
        <p>{props.address}</p>
        <p>${props.price}CAD per night</p>
        <div>
          <button className="btn btn-danger" onClick={onDelete}>Delete Listing</button>
        </div>
      </div>
    </div>
  )
}

export default ListingCard;
import React from "react";

const ListingCard = (props) => {
  return(
    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mt-4">
      <div className="card bg-light">
        <h6>{props.name}</h6>
        <p>{props.description}</p>
        <p>{props.address}</p>
        <p>${props.price}CAD per night</p>
      </div>
    </div>
  )
}

export default ListingCard;
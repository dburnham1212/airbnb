import React from "react";

import { useMutation, gql } from '@apollo/client';
const CANCEL_BOOKING = gql`
mutation DeleteBooking($id: Int!){
  deleteBooking(id: $id) {
    id
  }
}
`


const BookingCard = (props) => {
  
  const [deleteBooking, deletedBooking] = useMutation(CANCEL_BOOKING);
    
  const onDelete = () => {
    deleteBooking({
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
        <p>Booking Start {props.start_date}</p>
        <p>Booking End {props.end_date}</p>
        <div>
          <button className="btn btn-danger" onClick={onDelete}>Cancel Booking</button>
        </div>
      </div>
    </div>
  )
}

export default BookingCard;
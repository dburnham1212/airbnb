import React from "react";
import moment from "moment";

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
        <p>Booking Start {moment(props.start_date).format("MM/DD/YYYY")}</p>
        <p>Booking End {moment(props.end_date).format("MM/DD/YYYY")}</p>
        <div className="d-flex justify-content-between">
          <button className="btn btn-dark">Change Booking</button>
          <button className="btn btn-danger" onClick={onDelete}>Cancel Booking</button>
        </div>
      </div>
    </div>
  )
}

export default BookingCard;
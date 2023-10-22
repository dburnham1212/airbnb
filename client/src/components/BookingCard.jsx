import React, { useState } from "react";
import moment from "moment";
import ChangeBookingModal from "./ChangeBookingModal";
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";
const CANCEL_BOOKING = gql`
mutation DeleteBooking($id: Int!){
  deleteBooking(id: $id) {
    id
  }
}
`

const BookingCard = (props) => {
  const [deleteBooking, deletedBooking] = useMutation(CANCEL_BOOKING);
  
  const [editBooking, setEditBooking] = useState(false);

  const navigate = useNavigate();

  const onDelete = () => {
    deleteBooking({
      variables: {
        id: props.id
      }
    })
    props.removeBooking(props.id);
  }

  const navigateToUpdate = () => {
    navigate(`/updateBooking/${props.id}`)
  }

  return(
    <>
      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mt-4">
        <div className="card bg-light p-3">
          <h6>{props.name}</h6>
          <p>{props.description}</p>
          <p>{props.address}</p>
          <p>${props.price}CAD per night</p>
          <p>Booking Start {moment(props.start_date).format("MM/DD/YYYY")}</p>
          <p>Booking End {moment(props.end_date).format("MM/DD/YYYY")}</p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-dark" onClick={navigateToUpdate}>Change Booking</button>
            <button className="btn btn-danger" onClick={onDelete}>Cancel Booking</button>
          </div>
        </div>
      </div>
      {editBooking && <ChangeBookingModal
        closeModal={setEditBooking}
        id={props.id}
        startDate = {props.start_date}
        endDate = {props.end_date}
      />}
    </>
  )
}

export default BookingCard;
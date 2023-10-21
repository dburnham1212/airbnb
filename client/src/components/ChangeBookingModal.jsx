import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import moment from "moment";
import "../styles/modal.css"

const UPDATE_LISTING = gql`
mutation UpdateBooking($id: Int!, $start_date: Date!, $end_date: Date!){
  updateBooking(id: $id, start_date: $start_date, end_date: $end_date) {
    id
  }
}
`

const ChangeBookingModal = (props) => {

  const [formState, setFormState] = useState({
    startDate: props.startDate,
    endDate: props.endDate
  });

  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  }

  const [updateBooking, updatedBooking] = useMutation(UPDATE_LISTING);

  const onSubmit = (event) => {
    event.preventDefault();
    updateBooking({
      variables: {
        id: props.id, start_date: formState.startDate, end_date: formState.endDate
      }
    }).then(() => {
      props.closeModal(false)
    }).catch((err) => {
      console.log(err.message);
    })
  }

  return(
    <>
      <div className="modal-background">

      </div>
      <div className="modal-foreground card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-4 text-center position-fixed overflow-auto">
        <div className="card-header">
          <h2>Change Booking</h2>
        </div>
        <div className="card-body">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="form-group pt-4">
              <label className="form-label">Start Date</label>
              <input className="form-control" type="date" name="startDate" value={moment(formState.startDate).format("YYYY-MM-DD")} required onChange={(e) => handleChange(e)}></input>
            </div>
            <div className="form-group pt-4">
              <label className="form-label">End Date</label>
              <input className="form-control" type="date" name="endDate" value={moment(formState.endDate).format("YYYY-MM-DD")} required onChange={(e) => handleChange(e)}></input>
            </div>
            <div className="d-flex justify-content-end mx-2 my-4 gap-2">
              <button className="btn btn-danger" onClick={() => props.closeModal(false)}>Cancel</button>
              <button className="btn btn-dark" type="submit">Update Booking</button>
            </div>
          </form>
        </div>
      </div>
      
    </>    
  )
}

export default ChangeBookingModal;
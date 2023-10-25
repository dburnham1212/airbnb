import React, { useContext, useState } from "react";
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { authContext } from "../context/AuthContext";

// GraphQL query to cancel a booking
const CANCEL_BOOKING = gql`
mutation DeleteBooking($id: Int!, $token: String!){
  deleteBooking(id: $id, token: $token) {
    id
  }
}
`;

const BookingCard = (props) => {
  const {
    handleJWTErrors
  } = useContext(authContext)
  // State object
  const [inDeleteMode, setInDeleteMode] = useState(false);

  // Use Navigate to handle navigation
  const navigate = useNavigate();
  
  // Mutation used to delete a booking
  const [deleteBooking, _deletedBooking] = useMutation(CANCEL_BOOKING);

  // Function to use mutation to delete a booking and remove it from current list
  const onDelete = () => {
    deleteBooking({
      variables: {
        id: props.id,
        token: localStorage.getItem("token")
      }
    }).then(() => {
      props.removeBooking(props.id);
    }).catch((err) => {
      handleJWTErrors(err);
    })
  }

  // Function used to navigate to update a specific booking
  const navigateToUpdate = () => {
    navigate(`/updateBooking/${props.id}`)
  }

  return(
    <>
      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 mt-4">
        <div className="card bg-light p-3">
          <img className="object-fit-cover border rounded" src={props.image_url} alt="listing image" height="300" />
          <div className="border rounded my-3 py-2">
            <h5 className="border-bottom border-dark mx-3 py-2">{props.name.toUpperCase()}</h5>
            <p>{props.description}</p>
            <p>Address: {props.address}</p>
            <p>Booking Start: {moment(props.start_date).format("MM/DD/YYYY")}</p>
            <p>Booking End: {moment(props.end_date).format("MM/DD/YYYY")}</p>
            <div className="border-top w-100 py-2 fw-bold"> ${props.price} CAD per night</div>
          </div>
            {(moment(props.start_date) >= moment(new Date()).startOf('day')) ?  
              <>
                <div className="d-flex justify-content-end align-items-center gap-2">
                  {inDeleteMode ?  
                  <>
                    <span>Confirm Cancellation:</span>
                    <button className="btn btn-danger" onClick={onDelete}>Yes</button>
                    <button className="btn btn-dark" onClick={() => setInDeleteMode(false)}>No</button>
                  </>
                  :
                  <>
                    <button className="btn btn-dark" onClick={navigateToUpdate}>Change</button>
                    <button className="btn btn-danger" onClick={() => setInDeleteMode(true)}>Cancel</button>
                  </>
                  }
                </div>
              </>
              :
              <div className="d-flex justify-content-center gap-2">
                <div className="bg-dark text-warning p-2">Booking Completed</div>
              </div>
            }
        </div>
      </div>
    </>
  )
}

export default BookingCard;
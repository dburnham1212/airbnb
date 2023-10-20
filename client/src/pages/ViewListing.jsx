import React, {useState, useContext} from "react";
import { authContext } from "../context/AuthContext";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import moment from "moment"

const GET_LISTING = gql`
  query GetListing($id: Int!){
    listing(id: $id){
      id
      name
      description
      address
      price
      bookings {
        start_date
        end_date
        user {
          first_name
          last_name
        }
      }
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation AddBooking($listing_id: Int!, $user_id: Int!, $start_date: Date!, $end_date: Date!){
    addBooking(listing_id: $listing_id, user_id: $user_id, start_date: $start_date, end_date: $end_date){
      id
    }
  }
`

const ViewListing = () => {
  const {
    user
  } = useContext(authContext);

  const { listingId } = useParams();

  const [bookingFormState, setBookingFormState] = useState({})

  const [addBooking, newBooking] = useMutation(CREATE_BOOKING);

  const handleBookingFormChange = (event) => {
    setBookingFormState({...bookingFormState, [event.target.name]: event.target.value}); 
    console.log(bookingFormState);
  };

  // Function used to create a new booking
  const createBooking = (event) => {
    event.preventDefault()
    addBooking({
      variables: {
        listing_id: Number(listingId), user_id: user.id, start_date: bookingFormState.start_date, end_date: bookingFormState.end_date
      }
    });
  };

  // Query to get the listing data via GraphQL
  const { loading, error, data } = useQuery(GET_LISTING, {
    variables: { id: Number(listingId) }
  });

  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  // Create a variable for listing and set it to the data recieved
  const listing = data.listing;

  const bookingHistory = listing.bookings.map((booking) => {
    return (
      <tr>
        <td>{booking.user.first_name} {booking.user.last_name}</td>
        <td>{moment(booking.start_date).format("MM/DD/YYYY")}</td>
        <td>{moment(booking.end_date).format("MM/DD/YYYY")}</td>
      </tr>
    )
  })

  return(
    
    <div className="text-center py-4">
      <h1>{listing.name}</h1>
      <h6>{listing.description}</h6>
      <p>{listing.address}</p>
      <p>${listing.price} per night</p>
      <div className="card">
        <div className="card-header">
          <h6>Book Listing</h6>
        </div>
        <div className="card-body">
          <form className="px-3" onSubmit={(e) => createBooking(e)}>
            <div className="form-group">
              <div>
                <label className="form-label">Start Date</label>
                <input className="form-control "type="date" name="start_date" required onChange={(e) => handleBookingFormChange(e)}></input>

              </div>
              <div>
                <label className="form-label">End Date</label>
                <input className="form-control "type="date" name="end_date" required onChange={(e) => handleBookingFormChange(e)}></input>
              </div>
            </div>
            <div className="form-group py-3">
              <button className="btn btn-dark" type="submit"> Book Listing </button>
            </div>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h6>Booking History</h6>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ViewListing;
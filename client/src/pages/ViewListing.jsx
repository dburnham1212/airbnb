import React, {useContext} from "react";
import { authContext } from "../context/AuthContext";
import { useQuery, gql } from "@apollo/client";
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

const ViewListing = () => {
  const {
    user
  } = useContext(authContext);

  const { listingId } = useParams();

  const { loading, error, data } = useQuery(GET_LISTING, {
    variables: { id: Number(listingId) }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

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
          <form className="px-3">
            <div className="form-group">
              <div>
                <label className="form-label">Start Date</label>
                <input className="form-control "type="date"  placeholder="First Name" name="firstName"></input>

              </div>
              <div>
                <label className="form-label">End Date</label>
                <input className="form-control "type="date"  placeholder="First Name" name="firstName"></input>
              </div>
            </div>
            <div className="form-group py-3">
              <button className="btn btn-dark"> Book Listing </button>
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
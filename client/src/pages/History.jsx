import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";

import { useQuery, gql } from '@apollo/client';
import BookingCard from "../components/BookingCard";
import ResourceNotFound from "./ReourceNotFound";

// GraphQL query to get all bookings from db
const GET_BOOKINGS = gql`
  query GetBookings($id: Int!, $token: String!) {
    user_bookings(id: $id, token: $token){
      id
      start_date
      end_date
      listing{
        image_url
        name
        description
        address
        price
      }
    }
  }
`;

const History = () => {
  // Import user object from context
  const {
    user,
    handleJWTErrors
  } = useContext(authContext);

  // State object
  const [bookings, setBookings] = useState([]);

  // Query used to get the bookings from the db
  const { loading, error, data } = useQuery(GET_BOOKINGS, {
    variables: { id: user.id, token: localStorage.getItem("token")},
    fetchPolicy: 'cache-and-network'
  });

  // Function used to remove a booking from already created bookings list
  const removeBooking = (bookingId) => {
    setBookings(bookings.filter(booking => booking.id !== bookingId));
  }

  // Set bookings state object once we have recieved the bookings from the db
  useEffect (() => {
    if (!loading) {
      if (error) {
        handleJWTErrors(error)
      } else {
        setBookings(data.user_bookings);
      }
    }
  }, [loading]) 

  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <ResourceNotFound/>;

  // Set up a list of booking cards that represents the users booking history
  const history = bookings.map((booking) => 
    <BookingCard
      key={booking.id}
      id={booking.id}
      image_url={booking.listing.image_url}
      name={booking.listing.name}
      description={booking.listing.description}
      address={booking.listing.address}
      price={booking.listing.price}
      start_date={booking.start_date}
      end_date={booking.end_date}
      removeBooking={removeBooking}
    />
  );

  return(
    <div className="text-center mb-3">
      <h3 className="py-2 bg-light">Booking History</h3>
      <div className="container-fluid">
        <div className="row">
          {history.length > 0 ?
          <>
            {history}
          </>
          :
          <div className="pt-4">
            <h6>No Bookings To Display</h6>
          </div>
          }
        </div>  
      </div>
    </div>
  )
}

export default History;
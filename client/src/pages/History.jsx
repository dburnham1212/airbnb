import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";

import { useQuery, gql } from '@apollo/client';
import BookingCard from "../components/BookingCard";

const GET_BOOKINGS = gql`
  query GetBookings($id: Int!) {
    user_bookings(id: $id){
      id
      start_date
      end_date
      listing{
        name
        description
        address
        price
      }
    }
  }
`;

const History = () => {
  const {
    user
  } = useContext(authContext);

  const [bookings, setBookings] = useState([]);

  const { loading, error, data } = useQuery(GET_BOOKINGS, {
    variables: { id: user.id },
    fetchPolicy: 'cache-and-network'
  });

  useEffect (() => {
    if(!loading) {
      setBookings(data.user_bookings);
    }
  }, [loading]) 

  const removeBooking = (bookingId) => {
    setBookings(bookings.filter(booking => booking.id !== bookingId));
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const history = bookings.map((booking) => 
    <BookingCard
      key={booking.id}
      id={booking.id}
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
    <div className="text-center py-4">
      <h1>Booking History</h1>
      <div className="container-fluid">
        <div className="row">
          {history}
        </div>  
      </div>
    </div>
  )
}

export default History;
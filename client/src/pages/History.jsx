import React from "react";

import { useQuery, gql } from '@apollo/client';
import BookingCard from "../components/BookingCard";

const GET_BOOKINGS = gql`
  query GetBookings {
    user_bookings(id:${1}){
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
  const { loading, error, data } = useQuery(GET_BOOKINGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const history = data.user_bookings.map((booking) => 
    <BookingCard
      name={booking.listing.name}
      description={booking.listing.description}
      address={booking.listing.address}
      price={booking.listing.price}
      start_date={booking.start_date}
      end_date={booking.end_date}
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
import React from "react";

import ListingCard from "../components/ListingCard";

import { useQuery, gql } from '@apollo/client';

const GET_LISTINGS = gql`
  query GetListings {
    user_listings(id:${1}){
      id
      name
      description
      address
      price
    }
  }
`;

const ViewListings = () => {
  const { loading, error, data } = useQuery(GET_LISTINGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const listings = data.user_listings.map((listing) => 
    <ListingCard 
      key={listing.id} 
      name={listing.name}
      description={listing.description}
      address={listing.address}
      price={listing.price}
    />
  );

  return(
    
    <div className="text-center py-4">
      <h1>My Listings</h1>
      <div className="container-fluid">
        <div className="row">
          {listings}
        </div>  
      </div>
    </div>
  )
}

export default ViewListings;
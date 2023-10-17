import React, {useEffect} from "react";

import ListingCard from "./ListingCard";

import { useQuery, gql } from '@apollo/client';

const GET_LISTINGS = gql`
  query GetListings {
    listings{
      id
      name
      description
      address
      price
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_LISTINGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const listings = data.listings.map((listing) => 
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
      <h1>Listings</h1>
      <div className="container-fluid">
        <div className="row">
          {listings}
        </div>  
      </div>
    </div>
  )
}

export default Home;
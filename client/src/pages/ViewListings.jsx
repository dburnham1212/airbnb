import React, {useContext, useEffect, useState} from "react";
import { authContext } from "../context/AuthContext";

import ListingCard from "../components/ListingCard";

import { useQuery, gql } from '@apollo/client';

const GET_LISTINGS = gql`
  query GetListings($id: Int!){
    user_listings(id: $id){
      id
      image_url
      name
      description
      address
      price
    }
  }
`;

const ViewListings = () => {
  const {
    user
  } = useContext(authContext);

  const [listings, setListings] = useState([]);

  const { loading, error, data } = useQuery(GET_LISTINGS, {
    variables: {id: user.id},
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (!loading) {
      setListings(data.user_listings);
    }
  }, [loading])

  const removeListing = (listingId) => {
    setListings(listings.filter(listing => listing.id !== listingId))
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const displayListings = listings.map((listing) => 
    <ListingCard 
      key={listing.id} 
      id={listing.id}
      image_url={listing.image_url}
      name={listing.name}
      description={listing.description}
      address={listing.address}
      price={listing.price}
      canEdit={true}
      removeListing={removeListing}
    />
  );

  return(
    
    <div className="text-center">
       <h3 className="py-2 bg-light">My Listings</h3>
      <div className="container-fluid">
        <div className="row">
          {displayListings.length > 0 ?
          <>
            {displayListings}
          </>
          :
          <div className="pt-4">
            <h6>No Listings To Display</h6>
          </div>
          }
        </div>  
      </div>
    </div>
  )
}

export default ViewListings;
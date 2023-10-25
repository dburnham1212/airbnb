import React, {useContext, useEffect, useState} from "react";
import { authContext } from "../context/AuthContext";
import { useQuery, gql } from '@apollo/client';

// Import components used
import ListingCard from "../components/ListingCard";
import ResourceNotFound from "./ReourceNotFound";

// Get listings GraphQL query
const GET_LISTINGS = gql`
  query GetListings($id: Int!, $token: String!){
    user_listings(id: $id, token: $token){
      id
      image_url
      name
      description
      address
      price
    }
  }
`;

const MyListings = () => {
  // Import user object from context
  const {
    user,
    handleJWTErrors
  } = useContext(authContext);

  // State objects 
  const [listings, setListings] = useState([]);

  // Run GraphQL query to get all of the listings for the page
  const { loading, error, data } = useQuery(GET_LISTINGS, {
    variables: {id: user.id, token: localStorage.getItem("token") },
    fetchPolicy: 'cache-and-network'
  });

  // Wait for query to finish loading and assign results to state object 
  useEffect(() => {
    if (!loading) {
      if(error){
        handleJWTErrors(error)
      } else {
        setListings(data.user_listings);
      }
    }
  }, [loading]);

  // Function used to delete a listing so that we do not need to refresh the page
  const removeListing = (listingId) => {
    setListings(listings.filter(listing => listing.id !== listingId));
  };

  // Wait for query results to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <ResourceNotFound/>;

  // Set up array of listing cards to display on the page
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
    
    <div className="text-center mb-3">
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

export default MyListings;
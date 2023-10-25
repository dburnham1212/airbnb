import React, {useEffect, useState} from "react";
import { useQuery, useLazyQuery, gql } from '@apollo/client';

// Import components
import ListingCard from "../components/ListingCard";

// GraphQL query to retrieve all listings
const GET_LISTINGS = gql`
  query GetListings {
    listings{
      id
      image_url
      name
      description
      address
      price
    }
  }
`;

// GraphQL query to get listings based off of a string that is similar to the search results
const GET_ADDRESS_LISTINGS = gql`
  query GetAddressListings($address: String){
    listings_by_address(address: $address){
      id
      image_url
      name
      description
      address
      price
    }
  }
`;

const Listings = () => {
  // Set up our states
  const [searchString, setSearchString] = useState("");
  const [displayListings, setDisplayListings] = useState([]);

  // Use base query to get listings
  const { loading, error, data } = useQuery(GET_LISTINGS, {
    fetchPolicy: 'cache-and-network'
  });

  // Set up query to get listings based off of address
  const [loadAddressListings, _listingsByAddress] = useLazyQuery(GET_ADDRESS_LISTINGS, {
    variables: {address: searchString}
  });

  // Function to get listings based off search parameters
  const getListingsByAddress = () => {
    // Get the listings based of off search results
    loadAddressListings()
    .then((res) => {
      // If successful
      // Set the listings to the results from the query
      setDisplayListings(res.data.listings_by_address)
    })
    .catch((err) => {
      // If not successful log the results
      console.log(err.message)
    });
  }

  // Create use effect to set the current displayed listings
  useEffect(() => {
    if(!loading && !error) {
      setDisplayListings(data.listings);
    }
  }, [loading])

  // Check if we are loading or if there is an error
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  // Set up listing cards based off of listing data
  const listings = displayListings.map((listing) => 
    <ListingCard 
      key={listing.id} 
      id={listing.id}
      image_url={listing.image_url}
      name={listing.name}
      description={listing.description}
      address={listing.address}
      price={listing.price}
      canEdit={false}
    />
  );

  return(
    <div className="text-center mb-3">
      <h3 className="py-2 bg-light">Listings</h3>
      <div className="d-flex gap-2 mx-3 mt-3">
        <input className="form-control" placeholder="Search by address" onChange={(e) => {setSearchString(e.target.value)}}></input>
        <button className="btn btn-dark" onClick={getListingsByAddress}>Search</button>
      </div>
      <div className="container-fluid">
        <div className="row">
          {listings.length > 0 ? 
          <>
            {listings}
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

export default Listings;
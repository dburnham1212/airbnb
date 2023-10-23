import React, {useEffect, useState} from "react";

import ListingCard from "../components/ListingCard";

import { useQuery, useLazyQuery, gql } from '@apollo/client';

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

  const [searchString, setSearchString] = useState("");
  const [displayListings, setDisplayListings] = useState([]);

  const { loading, error, data } = useQuery(GET_LISTINGS);

  const [loadAddressListings, listingsByAddress] = useLazyQuery(GET_ADDRESS_LISTINGS, {
    variables: {address: searchString},
    fetchPolicy: 'cache-and-network',
  });

  const getListingsByAddress = async () => {
    await loadAddressListings();
    setDisplayListings(listingsByAddress.data.listings_by_address)
  }


  useEffect(() => {
    if(!loading) {
      setDisplayListings(data.listings);
    }
  }, [loading])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;


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
    
    <div className="text-center py-4">
      <h1>Listings</h1>
      <div className="d-flex gap-2 mx-3 mt-3">
        <input className="form-control" placeholder="Search by address" onChange={(e) => {setSearchString(e.target.value)}}></input>
        <button className="btn btn-dark" onClick={getListingsByAddress}>Search</button>
      </div>
      <div className="container-fluid">
        <div className="row">
          {listings}
        </div>  
      </div>
    </div>
  )
}

export default Listings;
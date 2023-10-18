const { gql } = require("apollo-server-express");

module.exports = gql`
type User {
  id: ID
  first_name: String 
  last_name: String
  phone_number: String
  address: String
  email: String
  password: String
}

type Listing {
  id: ID
  user_id: Int 
  name: String
  description: String
  address: String
  price: Int
  booking: [Booking]
}

input ListingInput {
  user_id: Int
  name: String
  description: String
  address: String
  price: Int
}

type Booking {
  id: ID
  listing_id: Int
  user_id: Int
  start_date: Int
  end_date: Int
  listing: Listing
}

type Query {
  listing(id: ID!): Listing!
  getListings: [Listing]
}
`
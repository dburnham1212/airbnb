const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} = require('graphql');

const listings = require('../db/queries/listings');
const bookings = require('../db/queries/bookings');

const { ListingType, BookingType } = require("./typeDefs");
const { verifyJWT } = require("./verifyJWT")

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: "Root Query",
  fields: () => ({
    listing: {
      type: ListingType,
      description: "A Single Listing",
      args: {
        id: { type: GraphQLInt },
        token: { type: GraphQLString }
      },
      resolve: (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        }
        // If not run the query and provide results
        return listings.getListingById(args.id);
      }
    },
    listings: { 
      type: new GraphQLList(ListingType),
      description: 'List of all listings',
      resolve: () => listings.getAllListings()
    },
    listings_by_address: {
      type: new GraphQLList(ListingType),
      description: 'List of listings by address',
      args: {
        address: { type: GraphQLString }
      },
      resolve: (_, args) => listings.getListingsByAddress(`%${args.address}%`)
    },
    user_listings: {
      type: new GraphQLList(ListingType),
      description: 'List of user listings',
      args: {
        id: { type: GraphQLInt },
        token: { type: GraphQLString }
      },
      resolve: (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        }
        // If not run the query and provide results
        return listings.getListingsByUserId(args.id);
      }
    },
    booking: {
      type: BookingType,
      description: "A Single Booking",
      args: {
        id: { type: GraphQLInt },
        token: { type: GraphQLString }
      },
      resolve: (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        }
        // If not run the query and provide results
        return bookings.getBookingById(args.id);
      } 
    },
    bookings: { 
      type: new GraphQLList(BookingType),
      description: 'List of all bookings',
      resolve: () => bookings.getAllBookings()
    },
    user_bookings: {
      type: new GraphQLList(BookingType),
      description: 'List of user bookings',
      args: {
        id: { type: GraphQLInt },
        token: { type: GraphQLString }
      },
      resolve: (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        }
        // If not run the query and provide results
        return bookings.getBookingsByUserId(args.id);
      }
    }
  })
})

module.exports = { RootQueryType }
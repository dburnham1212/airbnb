const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLScalarType
} = require('graphql');

const listings = require('../db/queries/listings');
const bookings = require('../db/queries/bookings');

const { UserType, ListingType, BookingType } = require("./typeDefs")

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: "Root Query",
  fields: () => ({
    listing: {
      type: ListingType,
      description: "A Single Listing",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => listings.getListingById(args.id)
    },
    listings: { 
      type: new GraphQLList(ListingType),
      description: 'List of all listings',
      resolve: () => listings.getAllListings()
    },
    user_listings: {
      type: new GraphQLList(ListingType),
      description: 'List of user listings',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => listings.getListingsByUserId(args.id)
    },
    booking: {
      type: BookingType,
      description: "A Single Booking",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => bookings.getBookingById(args.id)
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
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => bookings.getBookingsByUserId(args.id)
    }
  })
})

module.exports = { RootQueryType }
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLScalarType
} = require('graphql');

const { DateScalar} = require('./createdTypes');
const users = require('../db/queries/users');
const listings = require('../db/queries/listings');
const bookings = require('../db/queries/bookings');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This is a user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt)},
    first_name: { type: new GraphQLNonNull(GraphQLString)},
    last_name: {type: new GraphQLNonNull(GraphQLString)},
    phone_number: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)},
    role: {type: new GraphQLNonNull(GraphQLString)},
    token: {type: new GraphQLNonNull(GraphQLString)},
  })
})

const ListingType = new GraphQLObjectType({
  name: 'Listing',
  description: 'This is a listing',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt)},
    user_id: { type: new GraphQLNonNull(GraphQLInt)},
    image_url: { type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    address: {type: new GraphQLNonNull(GraphQLString)},
    price: {type: new GraphQLNonNull(GraphQLString)},
    bookings: {
      type: new GraphQLList(BookingType),
      resolve: (listing) => {
        return bookings.getBookingsByListingId(listing.id)
      }
    }
  })
})

const BookingType = new GraphQLObjectType({
  name: 'Booking',
  description: 'This is a booking',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt)},
    listing_id: {type: new GraphQLNonNull(GraphQLInt)},
    user_id: {type: new GraphQLNonNull(GraphQLInt)},
    start_date: {type: new GraphQLNonNull(DateScalar)},
    end_date: {type: new GraphQLNonNull(DateScalar)},
    listing: {
      type: ListingType,
      resolve: (booking) => {
        return listings.getListingById(booking.listing_id)
      }
    },
    user: {
      type: UserType,
      resolve: (booking) => {
        return users.getUserById(booking.user_id)
      }
    }
  })
})

module.exports = { UserType, ListingType, BookingType }
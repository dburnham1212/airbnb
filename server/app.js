/* eslint-disable camelcase */
require('dotenv').config();
const { ENVIROMENT, PORT } = process.env;

const listings = require('./db/queries/listings');
const bookings = require('./db/queries/bookings');

const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLScalarType
} = require('graphql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');


const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    // Serialize the date to a string, e.g., in ISO 8601 format
    return value.toISOString();
  },
  parseValue(value) {
    // Parse the date from a string to a Date object
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      // Parse the date from a string literal
      return new Date(ast.value);
    }
    return null; // Invalid input
  },
});

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
    
  })
})

const ListingType = new GraphQLObjectType({
  name: 'Listing',
  description: 'This is a listing',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt)},
    user_id: { type: new GraphQLNonNull(GraphQLInt)},
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
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: "Root Query",
  fields: () => ({
    user: {
      type: UserType,
      description: "A Single User",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => users.find(user => user.id === args.id)
    },
    listing: {
      type: ListingType,
      description: "A Single Listing",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => listings.getListingById(args.id)
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
      resolve: (parent, args) => listings.getListingsByUserId(args.id)
    },
    booking: {
      type: BookingType,
      description: "A Single Booking",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => bookings.getBookingById(args.id)
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
      resolve: (parent, args) => bookings.getBookingsByUserId(args.id)
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    createUser: {
      type: UserType,
      description: "Add a user",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt)},
        first_name: { type: new GraphQLNonNull(GraphQLString)},
        last_name: {type: new GraphQLNonNull(GraphQLString)},
        phone_number: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve : (parent, args) => {
        const user = {first_name: args.first_name, last_name: args.last_name, phone_number: args.phone_number, email: args.email, password: args.password}
        return user;
      }
    },
    addListing: {
      type: ListingType,
      description: 'Add a listing',
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        address: {type: new GraphQLNonNull(GraphQLString)},
        price: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: (parent, args) => {
        const listing = { id: bookings.length, user_id: args.user_id, name: args.name, description: args.description, address: args.address, price: args.price};
        listings.push(listing)
        return listing;
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

// middleware setup
const app = express();
app.use(morgan(ENVIROMENT));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

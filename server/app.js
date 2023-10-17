/* eslint-disable camelcase */
require('dotenv').config();
const { ENVIROMENT, PORT } = process.env;

const listings = [
  {  
    id: 0,
    user_id: 1,
    name: "Small Cottage",
    description: "A small cottage by the water",
    address: "123 Fake Street",
    price: "100"
  },
  {  
    id: 1,
    user_id: 1,
    name: "Smaller Cottage",
    description: "A smaller cottage by the water",
    address: "1234 Fake Street",
    price: "120"
  }
];

const bookings = [
  {
    id: 0,
    listing_id: 0,
    user_id: 1,
    start_date: Date.now(),
    end_date: Date.now() 
  },
  {
    id: 1,
    listing_id: 1,
    user_id: 1,
    start_date: Date.now(),
    end_date: Date.now() 
  }
]

const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

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
    
  })
})

const BookingType = new GraphQLObjectType({
  name: 'Booking',
  description: 'This is a booking',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt)},
    listing_id: {type: new GraphQLNonNull(GraphQLInt)},
    user_id: {type: new GraphQLNonNull(GraphQLInt)},
    listing: {
      type: ListingType,
      resolve: (booking) => {
        return listings.find(listing => booking.listing_id === listing.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: "Root Query",
  fields: () => ({
    listings: { 
      type: new GraphQLList(ListingType),
      description: 'List of all listings',
      resolve: () => listings
    },
    booking: {
      type: BookingType,
      description: "A Single Booking",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => bookings.find(booking => booking.id === args.id)
    },
    bookings: { 
      type: new GraphQLList(BookingType),
      description: 'List of all bookings',
      resolve: () => bookings
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
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

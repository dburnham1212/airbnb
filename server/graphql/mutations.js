const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLScalarType
} = require('graphql');


const { UserType, ListingType, BookingType } = require("./typeDefs")

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

module.exports = { RootMutationType }
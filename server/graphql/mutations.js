const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLScalarType
} = require('graphql');

const users = require('../db/queries/users');

const { UserType, ListingType, BookingType } = require("./typeDefs")

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    registerUser: {
      type: UserType,
      description: "Add a user",
      args: {
        first_name: { type: new GraphQLNonNull(GraphQLString)},
        last_name: {type: new GraphQLNonNull(GraphQLString)},
        phone_number: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve : async (_, args) => {
        const user = {first_name: args.first_name, last_name: args.last_name, phone_number: args.phone_number, email: args.email, password: args.password}

        // Check if an old user has the current email used
        const oldUser = await users.getUserByEmail(user);

        if (oldUser) {
          return new Error(`A user with the email ${user.email} already exists`);
        } 

        // If user email doesnt exist create a new user in the database
        const newUser = users.createUser(user);

        // Return user created in database
        return newUser;
      }
    },
    loginUser: {
      type: UserType,
      description: "Add a user",
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve : async (_, args) => {
        const user = {email: args.email, password: args.password};
        
        // Check if an old user has the current email used
        const checkUser = await users.getUserByEmail(user);

        return checkUser;
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
      resolve: (_, args) => {
        const listing = { id: bookings.length, user_id: args.user_id, name: args.name, description: args.description, address: args.address, price: args.price};
        listings.push(listing)
        return listing;
      }
    }
  })
})

module.exports = { RootMutationType }
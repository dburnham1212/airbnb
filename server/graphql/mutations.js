const graphql = require('graphql');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLScalarType
} = require('graphql');

const { DateScalar } = require('./createdTypes');
const users = require('../db/queries/users');
const listings = require('../db/queries/listings');
const bookings = require('../db/queries/bookings');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const { UserType, ListingType, BookingType } = require("./typeDefs")

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    // -------------------- USER MUTATIONS -------------------- 
    registerUser: {
      type: UserType,
      description: "Add a user",
      args: {
        first_name: { type: new GraphQLNonNull(GraphQLString)},
        last_name: {type: new GraphQLNonNull(GraphQLString)},
        phone_number: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        role: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve : async (_, args) => {
        const user = {first_name: args.first_name, last_name: args.last_name, phone_number: args.phone_number, email: args.email, password: args.password, role: args.role}

        // Check if an old user has the current email used
        const oldUser = await users.getUserByEmail(user);

        if (oldUser) {
          return new graphql.GraphQLError(`A user with the email ${user.email} already exists`, {
            extensions: {
              code: 'EMAIL_ALREAD_FOUND',
            },
          });
        } 

        // Encrypt password with bcrypt
        user.password = bcrypt.hashSync(user.password, 12);
        
        // If user email doesnt exist create a new user in the database
        const newUser = await users.createUser(user);
        
        // remove password field because we do not need to send it back
        delete newUser.password;

        // Create json web token
        const token = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '2h'
        });

        newUser.token = token;

        // Return user created in database
        return newUser;
      }
    },
    loginUser: {
      type: UserType,
      description: 'Add a user',
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve : async (_, args) => {
        const user = {email: args.email, password: args.password};
        
        // Check if a user exists with that email
        const checkUser = await users.getUserByEmail(user);

        if(!checkUser || !bcrypt.compareSync(user.password, checkUser.password)) {
          return new graphql.GraphQLError(`Invalid Credentials`, {
            extensions: {
              code: 'INVALID_CREDENTIALS',
            },
          });
        }

        // remove password field because we do not need to send it back
        delete checkUser.password;

        // Create json web token
        const token = jwt.sign(checkUser, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '2h'
        });

        checkUser.token = token;
        
        return checkUser;
      }
    },
    // -------------------- LISTING MUTATIONS -------------------- 
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
      resolve: async (_, args) => {
        const listing = { user_id: args.user_id, name: args.name, description: args.description, address: args.address, price: args.price};
        const newListing = await listings.createListing(listing);
        return newListing;
      }
    },
    deleteListing: {
      type: ListingType,
      description: 'Delete a listing',
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: async (_, args) => {
        const deletedListing = await listings.deleteListingById(args.id);
        return deletedListing
      }
    },
    // -------------------- BOOKING MUTATIONS -------------------- 
    addBooking: {
      type: BookingType,
      description: 'Add a booking',
      args: {
        listing_id: {type: new GraphQLNonNull(GraphQLInt)},
        user_id: {type: new GraphQLNonNull(GraphQLInt)},
        start_date: {type: new GraphQLNonNull(DateScalar)},
        end_date: {type: new GraphQLNonNull(DateScalar)},
      },
      resolve: async (_, args) => {
        const booking = { listing_id: args.listing_id, user_id: args.user_id, start_date: args.start_date, end_date: args.end_date};
        const createdBooking = await bookings.createBooking(booking);
        return createdBooking;
      } 
    },
    updateBooking: {
      type: BookingType,
      description: 'Update a booking',
      args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        start_date: {type: new GraphQLNonNull(DateScalar)},
        end_date: {type: new GraphQLNonNull(DateScalar)},
      },
      resolve: async (_, args) => {
        const booking = { id: args.id, start_date: args.start_date, end_date: args.end_date};
        const updatedBooking = await bookings.updateBooking(booking)
        return updatedBooking
      }
    },
    deleteBooking: {
      type: BookingType,
      description: 'Delete a booking',
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: async (_, args) => {
        const deletedBooking = await bookings.deleteBookingById(args.id);
        return deletedBooking
      }
    }
  }),
})

module.exports = { RootMutationType }
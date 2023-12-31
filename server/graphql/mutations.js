const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

const { DateScalar } = require('./createdTypes');
const users = require('../db/queries/users');
const listings = require('../db/queries/listings');
const bookings = require('../db/queries/bookings');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { verifyJWT } = require("./verifyJWT");

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
        const user = {
          first_name: args.first_name.toLowerCase(), 
          last_name: args.last_name.toLowerCase(), 
          phone_number: args.phone_number, 
          email: args.email.toLowerCase(), 
          password: args.password,
          role: args.role
        }

        // Check if an old user has the current email used
        const oldUser = await users.getUserByEmail(user);

        // Check that the user doesnt exist otherwise return an error
        if (oldUser) {
          return new graphql.GraphQLError(`A user with the email ${user.email} already exists`, {
            extensions: {
              code: 'EMAIL_ALREADY_FOUND',
            },
          });
        }; 

        // Encrypt password with bcrypt
        user.password = bcrypt.hashSync(user.password, 12);
        
        // If user email doesnt exist create a new user in the database
        const newUser = await users.createUser(user);
        
        // remove password field because we do not need to send it back
        delete newUser.password;

        // Create json web token
        const token = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '2h'
        });

        // Store token in the user object
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
        const user = {email: args.email.toLowerCase(), password: args.password};
        
        // Check if a user exists with that email
        const checkUser = await users.getUserByEmail(user);

        // Check if the user exists and their password matches the stored password
        if(!checkUser || !bcrypt.compareSync(user.password, checkUser.password)) {
          return new graphql.GraphQLError(`Invalid Credentials`, {
            extensions: {
              code: 'INVALID_CREDENTIALS',
            },
          });
        };

        // remove password field because we do not need to send it back
        delete checkUser.password;

        // Create json web token
        const token = jwt.sign(checkUser, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '2h'
        });

        // Store token in the user object
        checkUser.token = token;
        
        // Return the user that was retrieved from the database
        return checkUser;
      }
    },
    // -------------------- LISTING MUTATIONS -------------------- 
    addListing: {
      type: ListingType,
      description: 'Add a listing',
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt)},
        image_url: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        address: {type: new GraphQLNonNull(GraphQLString)},
        price: {type: new GraphQLNonNull(GraphQLInt)},
        token: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        }
        // If not run the mutation and provide results
        const listing = { user_id: args.user_id, image_url: args.image_url, name: args.name, description: args.description, address: args.address, price: args.price};
        const newListing = await listings.createListing(listing);
        return newListing;
      }
    },
    updateListing: {
      type: ListingType,
      description: 'Update a listing',
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt)},
        image_url: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        address: {type: new GraphQLNonNull(GraphQLString)},
        price: {type: new GraphQLNonNull(GraphQLInt)},
        token: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        };
        // If not run the mutation and provide results
        const listing = { id: args.id, image_url: args.image_url, name: args.name, description: args.description, address: args.address, price: args.price};
        const updatedListing = await listings.updateListing(listing);
        return updatedListing;
      }
    },
    deleteListing: {
      type: ListingType,
      description: 'Delete a listing',
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt)},
        token: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        }
        // If not run the mutation and provide results
        const deletedListing = await listings.deleteListingById(args.id);
        return deletedListing;
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
        token: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        };
        // If not run the mutation and provide results
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
        token: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        };
        // If not run the mutation and provide results
        const booking = { id: args.id, start_date: args.start_date, end_date: args.end_date};
        const updatedBooking = await bookings.updateBooking(booking);
        return updatedBooking;
      }
    },
    deleteBooking: {
      type: BookingType,
      description: 'Delete a booking',
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt)},
        token: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: async (_, args) => {
        // Verify the token recieved from client
        const errors = verifyJWT(args);
        // if there are errors return the errors to the client
        if(errors) {
          return errors;
        };
        // If not run the mutation and provide results
        const deletedBooking = await bookings.deleteBookingById(args.id);
        return deletedBooking;
      }
    }
  }),
})

module.exports = { RootMutationType }
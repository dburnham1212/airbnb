const graphql = require('graphql');
const jwt = require('jsonwebtoken');

// Function used to verify JSON Web Tokens and provide a proper error if the token is invalid
const verifyJWT = (args) => {
  try {
    jwt.verify(args.token, process.env.REFRESH_TOKEN_SECRET);
  }
  catch (err){
    return new graphql.GraphQLError(err.message, {
      extensions: {
        code: 'JWT_ERROR',
      },
    });
  }
  return null;
}

module.exports = {verifyJWT};
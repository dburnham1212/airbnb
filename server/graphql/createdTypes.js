const {
  GraphQLScalarType
} = require('graphql');

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

module.exports = { DateScalar }
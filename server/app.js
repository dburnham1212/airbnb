require('dotenv').config();
const { ENVIROMENT, PORT } = process.env;
const express = require('express');

const expressGraphQL = require('express-graphql').graphqlHTTP;
const { GraphQLSchema } = require('graphql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const { RootQueryType } = require('./graphql/queries');
const { RootMutationType } = require('./graphql/mutations')

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

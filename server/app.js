/* eslint-disable camelcase */
require('dotenv').config();
const { ENVIROMENT, PORT } = process.env;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');

//routes import
const logRoute = require('./routes/logRoute.js');

// middleware setup
const app = express();
app.use(morgan(ENVIROMENT));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// established session
app.use(cookieParser('secretcode'));
app.use(
  session({
    secret: 'secretcode',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/programs', progamsRoutes);


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

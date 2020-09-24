// express, body-parser, cors, mongoose

// Import the express library in this file
const express = require('express');
// Assign to server the express library
const server = express();
// Import body-parser
const bodyParser = require('body-parser');
// Import cors
const cors = require('cors');

server.use(cors());
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// Import UserModel
const UserModel = require('./UserModel');

require('dotenv').config();
// console.log(process.env);

// Import mongoose
const mongoose = require('mongoose');

const dbURL = process.env.DB_URL;
mongoose
  .connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
  // for successful promise
  .then(() => {
    console.log('Connected to MongoDB');
  })
  // for failed promise
  .catch((e) => {
    console.log('an error occured', e);
  });

// Sample GET route
server.get(
  //1st argument
  '/',
  //2nd argument
  (req, res) => {
    const theHTML = '<h1>Welcome to My App</h1>';
    res.send(theHTML);
  }
);

server.post('/users/register', (req, res) => {
  const formData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  const newUser = new UserModel(formData);

  // 1. Make sure email is unique
  UserModel.findOne({email: req.body.email}).then(async (document) => {
    // if document exists, they already have an account
    // so reject registration
    if (document) {
      res.send({msg: 'An account with that email exists'});
    } else {
      newUser
        .save()
        .then((document) => {
          res.send(document);
        })
        .catch((e) => {
          console.log('error', e);
          res.send({e: e});
        });
    }
  });
});

server.listen(
  // port number
  process.env.PORT || 3002,
  // callback when (and if) the connection is OK
  () => {
    console.log('Your server is now running http://localhost:3002/');
  }
);

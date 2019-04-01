const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser')
const passport = require('passport')


mongoose.Promise = global.Promise;


const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// DB Config
const DATABASE_URL = require('./config/keys').DATABASE_URL
const PORT = require('./config/keys').PORT


// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)


// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// catch-all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
    res.status(404).json({ message: "Not Found" });
  });
  
  
  let server;
  
  function runServer(DATABASE_URL = "mongodb://localhost/react-test-db", port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        DATABASE_URL,
        err => {
          if (err) {
            return reject(err);
          }
          console.log('Connected to db')
          server = app
            .listen(port, () => {
              console.log(`Your app is listening on port ${port}`);
              resolve();
            })
            .on("error", err => {
              mongoose.disconnect();
              reject(err);
            });
        }
      );
    });
  }
  
 
  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }
  
  // if server.js is called directly (aka, with `node server.js`), this block
  // runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
  if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
  }
  
  module.exports = { app, runServer, closeServer };

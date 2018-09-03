const express = require('express');
const app = express();
const router = require('./blog-post-router');
const router2 = require('./author-router');
const morgan = require("morgan");
const mongoose = require("mongoose");
const {DATABASE_URL, PORT} = require("./config");



app.use(morgan('common'));
mongoose.Promise = global.Promise;


app.use('/blogs', router);
app.use('/authors', router2);
app.use('*', (req, res) => {
  res.status(404).send("Endpoint not found");
});




function runServer(databaseUrl, port =PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        databaseUrl,
        err => {
          if(err) {
            return reject(err);
          }
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
    })
  };


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
};

//clever!!! this basically allows for the app to run and use the DATABASE url if and only if the app is run from the server,
//and not from somewhere else
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.log(err));
};



module.exports = { app, runServer, closeServer };
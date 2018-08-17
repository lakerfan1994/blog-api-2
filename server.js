const express = require('express');
const app = express();
const router = require('./blog-post-router');
const morgan = require("morgan");

app.use(morgan('common'));



app.use('/blog-posts', router);






app.listen(8080);
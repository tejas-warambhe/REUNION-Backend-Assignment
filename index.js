require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const database = require('./database_connect');
const authentication = require('./routes/authentication');
const user = require('./routes/user');
const post = require('./routes/post');
//Database Connection with mongoDB
database();


//middlewares
app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

//Routes
app.use('/api', authentication);
app.use('/api', user);
app.use('/api', post);




const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
})

module.exports = app;
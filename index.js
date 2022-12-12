require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

//middlewares
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
})
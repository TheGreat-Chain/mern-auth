const express = require('express')
const app = express();
const PORT = process.env.PORT || 8080;

/**
 * HTTP REQUESTS AND REST API 
 * 
 * - GET    : get data
 * - PUT    : update data
 * - POST   : create data
 * - DELETE : delete data
 * - PATCH  : update partial data
 * 
 * More info : https://www.youtube.com/watch?v=PO3kQeNMbaY
 */

app.get("/", (req, res) => {
    console.log("Hello world");
    res.send();
});

app.listen(PORT, () => console.log("Serveur marche \n"));

/*************************************** */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// IMPORT ROUTES 
const authRoute = require('./routes/auth/auth');
const list_usersRoute = require('./routes/auth/list_users');

// ACCESS ENVIRONMENT VARIABLES
dotenv.config();

// DATABASE CONNEXION
mongoose.connect(process.env.DB_CONNECT, {}).then(() => console.log("Connected to database"));

// MIDDLEWARES -> parse incoming reqs + disabling cors
app.use(express.json(), cors());

// ROUTE MIDDLEWARE
app.use("/api/users", authRoute);
app.use("/api/users", list_usersRoute);



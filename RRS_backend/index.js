const express = require('express');
const app = express();
const port = 8000;
require('dotenv').config();
const db = require('./src/models')
app.listen(port, console.log(`Listening on http://localhost:${port}`))
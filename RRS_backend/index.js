const express = require('express');
const { json } = require('sequelize');
const app = express();
const port = 8080;

app.use(express.json())
app.use('/api', require('./src/routes/'))
app.listen(port, console.log(`Listening on http://localhost:${port}`))
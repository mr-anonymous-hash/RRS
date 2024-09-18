const express = require('express');
const { json } = require('sequelize');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json())
app.use('/api', require('./src/routes/'))
app.listen(port, console.log(`Listening on http://localhost:${port}`))
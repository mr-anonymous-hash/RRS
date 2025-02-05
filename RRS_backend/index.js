const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json())

app.use('/api', require('./src/routes/'))
app.use('/uploads', express.static('uploads'));
app.use('/image', express.static('images'));


app.listen(port, console.log(`Listening on http://localhost:${port}`))
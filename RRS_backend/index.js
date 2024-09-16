const express = require('express');
const app = express();
const port = 8000;

app.use('/api', require('./src/routes/index'))
app.listen(port, console.log(`Listening on http://localhost:${port}`))
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;

app.use(cors())
app.listen(port, () => {
    console.log('server listening on port ${port}')
})

app.get('/', (req, res) => {
    res.send('Hello from our server!')
})
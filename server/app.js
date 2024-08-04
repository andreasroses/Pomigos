const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;

app.use(cors())
app.use(bodyParser.json());

app.listen(port, () => {
    console.log('server listening on port ${port}')
})

app.get('/', (req, res) => {
    res.send('Hello from our server!')
})

app.post('/session', (req, res) => {
  const { duration } = req.body;
  console.log(`Session duration: ${duration} seconds`);
  res.send('Session saved!');
});

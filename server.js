const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let sensorData = {};

app.post('/data', (req, res) => {
  sensorData = req.body;
  console.log('Received data:', sensorData);
  res.status(200).send('Data received');
});

app.get('/data', (req, res) => {
  res.json(sensorData);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
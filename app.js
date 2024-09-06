const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes.js');
const twilioRoutes = require ('./routes/twilioRoutes.js')
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/contacts', contactRoutes);
app.use('/twilio', twilioRoutes);
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working!' });
  });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

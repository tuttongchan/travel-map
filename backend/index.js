const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoute = require('./routes/users');
const pinRoute = require('./routes/pins');
const guestRoute = require('./routes/guests');

dotenv.config();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

app.use('/api/users', userRoute);
app.use('/api/pins', pinRoute);
app.use('/api/guests', guestRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log('Backend server is running!');
});

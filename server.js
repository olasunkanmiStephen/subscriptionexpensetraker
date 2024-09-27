const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/subscriptions', require('./routes/subscriptions'));
app.use('/platforms', require('./routes/platform'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all handler to return the React app for any routes not matched above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

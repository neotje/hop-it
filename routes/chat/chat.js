const config = require('config');
const mongoose = require('mongoose');

// connect to database
mongoose.connect(config.get('userManager.mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });
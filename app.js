const path = require('path');
const express = require('express');
const app = express();

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

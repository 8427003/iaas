const express = require('express');
const app = express();
const SERVER_PORT = require('./config').SERVER_PORT;
const loadMiddleware = require('./common/middleware');
const loadRoutes = require('./routes');

loadMiddleware(app);
loadRoutes(app);

console.log('port:', SERVER_PORT || 3000)
app.listen(SERVER_PORT || 3000)

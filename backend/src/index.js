const express = require('express');
const bodyParser = require('body-parser');//解析,用req.body获取post参数
const app = express();
const connection = require('./helper/dbconnect.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
connection.init();
require('./controllers/projectTempate')(app);
require('./controllers/project')(app);
app.listen(3000)



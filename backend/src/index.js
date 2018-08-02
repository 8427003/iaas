const express = require('express');
const bodyParser = require('body-parser');//解析,用req.body获取post参数
const app = express();
const connection = require('./helper/dbconnect.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});
connection.init();
require('./controllers/projectTempate')(app);
require('./controllers/project')(app);
app.listen(3000)

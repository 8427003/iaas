module.exports = function (app) {
    app.use(
        require('./log'),
        require('./bodyParser'),
        require('./CORS')
    );
}


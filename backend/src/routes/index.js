module.exports = function(app) {
    require('../controllers/projectTempate')(app);
    //require('../controllers/project')(app);
    require('../controllers/mgproject')(app);
    require('../controllers/services')(app);
}


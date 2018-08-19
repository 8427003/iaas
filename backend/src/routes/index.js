module.exports = function(app) {
    require('../controllers/projectTempate')(app);
    require('../controllers/project')(app);
}


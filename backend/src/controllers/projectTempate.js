const projectTempateService = require('../services/projectTemplate');
const serviceTempateService = require('../services/serviceTemplate');
const resultWrap = require('../utils/resultWrap');
const uuidv1 = require('uuid/v1');

module.exports = function(router) {
    router.post('/api/iaas/project-template/add', add);
}

async function add (req, res, next) {
    const { name, desc, services } = req.body;
    const id = uuidv1();
    const author = 'admin';
    try{
        const [pResult, sResult] = await Promise.all([
            projectTempateService.add(id, name, desc, author),
            serviceTempateService.addList(services, id)
        ]);
        res.json(resultWrap());
    }
    catch (err) {
        res.json(resultWrap({}, err));
    }
}

function del(req, res, next) {

}

function update(req, res, next) {

}

function inspect(req, res, next){

}

function list(req, res, next) {

}


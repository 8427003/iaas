const projectTempateService = require('../services/projectTemplate');
const projectService = require('../services/project');
const resultWrap = require('../utils/resultWrap');
const uuidv1 = require('uuid/v1');

module.exports = function(router) {
    router.post('/api/iaas/project/create', create);
    router.get('/api/iaas/project/list', list);
    router.post('/api/iaas/project/del', del);
}

async function create (req, res, next) {
    const { dockerYAML, name, desc } = req.body;
    const id = uuidv1();
    const author = 'admin';
    try {
        const {stdout, stderr} = await projectService.create({id, dockerYAML, name, desc, author});
        return res.json(resultWrap({
            id,
            stdout,
            stderr,
        }));
    }
    catch(err) {
        return res.json(resultWrap({}, err.toString()));
    }
}

async function del (req, res, next) {
    const { id } = req.body;
    try {
        await projectService.del({id});
        res.json(resultWrap());
    }
    catch(err) {
        res.json(resultWrap({}, err));
    }
}

async function list (req, res, next) {
    try{
        const list = await projectService.list();
        return res.json(resultWrap(list));
    }
    catch(e) {
        return res.json(resultWrap({}, e));
    }
}

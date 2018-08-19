const projectTempateService = require('../services/projectTemplate');
const serviceTempateService = require('../services/serviceTemplate');
const resultWrap = require('../common/utils/resultWrap');
const yaml = require('js-yaml');
const uuidv1 = require('uuid/v1');

module.exports = function(router) {
    router.post('/api/iaas/projectTemplate/add', add);
    router.get('/api/iaas/projectTemplate/list', list);
    router.post('/api/iaas/projectTemplate/delete', del);
    router.get('/api/iaas/projectTemplate/inspect', inspect);
}

async function add (req, res, next) {
    const { name, desc, services, yamlRaw, label } = req.body;
    const id = uuidv1();
    const author = 'admin';
    try{
        const yamlData = yamlRaw ? yaml.safeLoad(yamlRaw) : undefined;
        const [pResult, sResult] = await Promise.all([
            projectTempateService.add(id, name, desc, author, label, yamlData),
            serviceTempateService.addList(services, yamlData, id)
        ]);
        res.json(resultWrap());
    }
    catch (err) {
        res.json(resultWrap({}, err));
    }
}

async function list (req, res, next) {
    try {
        const list = await projectTempateService.list();
        res.json(resultWrap(list));
    }
    catch (err) {
        res.json(resultWrap({}, err));
    }
}

async function del(req, res, next) {
    const { id } = req.body;
    try {
        await projectTempateService.del(id);
        res.json(resultWrap());
    }
    catch(err) {
        res.json(resultWrap({}, err))
    }
}

async function inspect(req, res, next){
    const id = req.query.id;
    try {
        const pt = await projectTempateService.inspect(id);
        res.json(resultWrap(pt));
    }
    catch (err) {
        res.json(resultWrap({}, err));
    }
}

function update(req, res, next) {

}


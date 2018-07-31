const projectTempateService = require('../services/projectTemplate');
const projectService = require('../services/project');
const resultWrap = require('../utils/resultWrap');
const uuidv1 = require('uuid/v1');

module.exports = function(router) {
    router.post('/api/iaas/project/create', create);
}

async function create (req, res, next) {
    const { dockerYAML, name, desc } = req.body;
    const id = uuidv1();
    const author = 'admin';
    try {
        const results = await projectService.create({id, dockerYAML, name, desc, author});
        return res.json(resultWrap(results));
    }
    catch(err) {
        return res.json(resultWrap({}, err));
    }
}
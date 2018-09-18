const projectTempateService = require('../services/projectTemplate');
const projectService = require('../services/mbproject');
const resultWrap = require('../common/utils/resultWrap');
const yaml = require('js-yaml');

module.exports = function(router) {
    router.post('/api/iaas/project/create', create);
    router.get('/api/iaas/project/list', list);
    router.post('/api/iaas/project/del', del);
    router.get('/api/iaas/project/inspect', inspect);
    router.post('/api/iaas/project/stop', stop);
    router.post('/api/iaas/project/restart', restart);
    router.post('/api/iaas/project/save', save);
    router.post('/api/iaas/project/createTemplate', createTemplate);
}

async function create (req, res, next) {
    const project = req.body;
    let stdout, stderr, result = null;
    try {
        result =  await projectService.create({project});
    }
    catch(err) {
        return res.json(resultWrap({}, err));
    }
    return res.json(resultWrap({
        stdout: result.stdout,
        stderr: result.stderr,
    }));
}

async function save(req, res, next) {
    const project = req.body;
    await projectService.save({project});
    return res.json(resultWrap());
}

async function createTemplate (req, res, next) {
    const project = req.body;
    await projectService.create({ project, isTemplate: true });
    return res.json(resultWrap());
}

async function inspect(req, res, next) {
    const { projectId } = req.query;
    const projectInfo = await projectService.inspect({ projectId });
    res.json(resultWrap(projectInfo));
}

async function del (req, res, next) {
    const { projectId } = req.body;
    console.log(projectId);
    await projectService.del({projectId});
    res.json(resultWrap());
}

async function list (req, res, next) {
    const { isTemplate } = req.query;
    let list = null;
    if(isTemplate) {
        list = await projectService.templateList();
    }
    else {
        list = await projectService.list();
    }
    return res.json(resultWrap(list));
}

async function stop(req, res, next) {
    const { projectId } = req.body;
    await projectService.stop({ projectId });
    return res.json(resultWrap());
}
async function restart(req, res, next) {
    const { projectId } = req.body;
    await projectService.restart({ projectId, isForce: true });
    return res.json(resultWrap());
}

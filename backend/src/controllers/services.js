const dockerService = require('../dockerAPI/dockerService');
const projectService = require('../services/mbproject');
const resultWrap = require('../common/utils/resultWrap');

module.exports = function(router) {
    router.post('/api/iaas/services/update', update);
    router.post('/api/iaas/services/stop', stop);
    router.post('/api/iaas/services/restart', restart);
}

async function update (req, res, next) {
    const { serviceId, config } = req.body;
    await dockerService.updateService({ serviceId, config })
    res.json(resultWrap());
}

async function restart (req, res, next) {
    const { serviceId, projectId } = req.body;
    await dockerService.removeService({ serviceId })
    await projectService.restart({ projectId })
    res.json(resultWrap());
}

async function stop(req, res, next) {
    const { serviceId } = req.body;
    await dockerService.removeService({ serviceId })
    res.json(resultWrap());
}

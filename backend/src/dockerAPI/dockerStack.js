const util = require('util');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const exec = util.promisify(require('child_process').exec);
const uuidv1 = require('uuid/v1');
const options2str = require('../utils/options2str');

async function deploy(options, STACK) {
    const optionsStr = options2str(options);
    const command = `docker stack deploy ${optionsStr} ${STACK}`;
    return await exec(command);
}
async function deployWrap(dockerYAML, STACK = uuidv1()) {
    const data = yaml.safeDump(dockerYAML);
    const file = `/var/tmp/${uuidv1()}.yml`
    fs.outputFileSync(file, data);
    try {
        return await deploy({'-c' : file}, STACK)
    }
    catch(err) {
        throw err;
    }
    finally {
        fs.remove(file);
    }
}
async function rm(STACK) {
    const command = `docker stack rm ${STACK}`;
    return await exec(command);
}
async function getServices(stackId) {
    const command = `docker service ls | grep ${stackId}`;
    const { stdout, stderr } await exec(command);
    console.log(stdout);
}

module.exports = {
    deploy,
    deployWrap,
    rm,
    getServices,
}

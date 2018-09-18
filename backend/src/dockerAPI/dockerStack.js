const util = require('util');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const exec = util.promisify(require('child_process').exec);
const shortid = require('shortid');
const options2str = require('../common/utils/options2str');

async function deploy(options, STACK) {
    const optionsStr = options2str(options);
    const command = `docker stack deploy ${optionsStr} ${STACK}`;
    console.log(command)
    const {stdout, stderr} = await exec(command);
    return {stdout, stderr};
}
async function deployWrap(yamlData, STACK = shortid.generate()) {
    const yamlRaw = yaml.safeDump(yamlData);
    const file = `/var/tmp/${STACK}.yml`
    fs.outputFileSync(file, yamlRaw);
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
    if(!STACK) {
        return;
    }
    const command = `docker stack rm ${STACK}`;
    console.log(command);
    const {stdout, stderr} = await exec(command);
    return {stdout, stderr};
}

module.exports = {
    deploy,
    deployWrap,
    rm
}

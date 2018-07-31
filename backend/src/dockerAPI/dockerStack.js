const util = require('util');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const exec = util.promisify(require('child_process').exec);
const uuidv1 = require('uuid/v1');
const options2str = require('../utils/options2str');

async function deploy(options, STACK) {
    const optionsStr = options2str(options);
    const command = `docker stack deploy ${optionsStr} ${STACK}`;
    try {
        const { stdout, stderr } = await exec(command);
        if(stderr) {
            console.warn(stderr);
        }
        if(stdout) {
            return STACK;
        }
    }
    catch(e) {
        throw new Error(`fail exec ${command} ${e}`)
    }
}
async function deployWrap(dockerYAML, STACK = uuidv1()) {
    const data = yaml.safeDump(dockerYAML);
    const file = `/var/tmp/${uuidv1()}.yml`
    fs.outputFileSync(file, data);
    try {
        return await deploy({'-c' : file}, STACK)
    }
    catch(e) {
        throw new Error(e);
    }
    finally {
        fs.remove(file);
    }
}

module.exports = {
    deploy,
    deployWrap,
}

const request = require('request-promise-native');
const baseUrl = 'http://unix:/var/run/docker.sock:';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getServicesBy({ stackId }) {
    if(!stackId) {
        return null;
    }
    const options = {
        headers: {
            host:'http'
        },
        qs: {
            filters: JSON.stringify({
                name: [ stackId ]
            })
        },
    }
    return JSON.parse(await request.get(`${baseUrl}/services`, options));
}

async function removeService({ serviceId }) {
    if(!serviceId) {
        return;
    }
    const command = `docker service rm ${serviceId}`;
    console.log(command)
    const {stdout, stderr} = await exec(command);
    return {stdout, stderr};
}

module.exports = {
    getServicesBy,
    removeService
}

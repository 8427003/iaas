const request = require('request-promise-native');
const baseUrl = 'http://unix:/var/run/docker.sock:';

async function getServicesBy({ stackId }) {
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

module.exports = {
    getServicesBy,
}

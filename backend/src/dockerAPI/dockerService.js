const request = require('request-promise-native');
const baseUrl = 'http://unix:/var/run/docker.sock:';

async function getServicesBy({ stackId }) {
    const options = {
        headers: {
            host:'http'
        },
        query: {
            filters: JSON.stringify({
                name: [ stackId ]
            })
        },
    }
    const [response, body] = await request.get(`${baseUrl}/services`, options)
    return body;
}

module.exports = {
    getServices,
}

const request = require('request');
request.get('http://unix:/var/run/docker.sock:/services', {headers: { host:'http' }}, function(err, response, body){
    console.log(body);
})

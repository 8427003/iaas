const fs = require('fs-extra');
const yaml = require('js-yaml');
var doc = yaml.safeLoad(fs.readFileSync('/users/lijun/git/dockerfiles/nginx.yml', 'utf8'));
console.log(JSON.stringify(doc))

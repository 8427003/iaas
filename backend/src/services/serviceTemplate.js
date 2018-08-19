const db = require('../common/helper/dbconnect');
const MODEL_NAME = 'service_template';
const yaml = require('js-yaml');
const _get = require('lodash/get');

module.exports = {
    addList: async (services = [], yamlData, projectTemplateId = '') => {
        if(!services.length) return;
        if('' === projectTemplateId) {
            throw new Error('params projectTemplateId required!');
        }

        const connection = db.getConnection();
        const modelData = services.map(item => {
            const service = _get(yamlData, `services.${item.name}`);
            console.log(service, `services.${item.name}`, 11111111)
            const extra = service ? JSON.stringify(service) : null

            return [
                item.name,
                item.image,
                item.desc,
                projectTemplateId,
                extra
            ]
        })
        try{
            const sql = `INSERT INTO ${MODEL_NAME} (name, image, \`desc\`, project_template, extra) VALUES ?`;
            const [ results ] = await connection.query(sql, [modelData])
            return results;
        }
        catch(err) {
            console.log(err)
            throw Error(err);
        }
    }
}

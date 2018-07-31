const db = require('../helper/dbconnect');
const MODEL_NAME = 'service_template';

module.exports = {
    addList: async (services = [], projectTemplateId = '') => {
        if(!services.length) return;
        if('' === projectTemplateId) {
            throw new Error('params projectTemplateId required!');
        }

        const connection = db.getConnection();
        const modelData = services.map(item => {
            return [
                item.image,
                item.extra,
                projectTemplateId
            ]
        })
        try{
            const sql = `INSERT INTO ${MODEL_NAME} (image, extra, project_template) VALUES ?`;
            const [ results ] = await connection.query(sql, [modelData])
            return results;
        }
        catch(err) {
            console.log(err)
            throw Error(err);
        }
    }
}

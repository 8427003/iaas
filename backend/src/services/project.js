const db = require('../helper/dbconnect');
const projectTemplateService = require('../services/projectTemplate');
const projectService = require('../services/project');
const dockerStack = require('../dockerAPI/dockerStack');
const uuidv1 = require('uuid/v1');
const MODEL_NAME = 'project';

module.exports = {
    create: async ({id, dockerYAML, name, desc, author}) => {
        const connection = db.getConnection();
        const now = new Date().getTime();
        const stackId = uuidv1();
        const modelData = {
            id,
            name,
            desc,
            createTime: now,
            updateTime: now,
            author,
            dockerYAML: JSON.stringify(dockerYAML),
            stackId
        }
        try {
            await connection.query(`INSERT INTO ${MODEL_NAME} SET ?`, modelData);
        } catch (err) {
            throw err
        }
        try {
            return await dockerStack.deployWrap(dockerYAML, stackId);
        }
        catch (err) {
            connection.query(`DELETE FROM ${MODEL_NAME} WHERE id = ?`, [id]);
            throw err;
        }
    }
}

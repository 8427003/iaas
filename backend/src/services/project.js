const db = require('../common/helper/dbconnect');
const projectTemplateService = require('../services/projectTemplate');
const projectService = require('../services/project');
const dockerStack = require('../dockerAPI/dockerStack');
const dockerService = require('../dockerAPI/dockerService');
const uuidv1 = require('uuid/v1');
const _get = require('lodash/get');
const MODEL_NAME = 'project';

module.exports = {
    create: async ({id, yamlData, name, desc, author}) => {
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
            yamlData: JSON.stringify(yamlData),
            stackId
        }
        try {
            await connection.query(`INSERT INTO ${MODEL_NAME} SET ?`, modelData);
        } catch (err) {
            throw err
        }
        try {
            return await dockerStack.deployWrap(yamlData, stackId);
        }
        catch (err) {
            connection.query(`DELETE FROM ${MODEL_NAME} WHERE id = ?`, [id]);
            throw err;
        }
    },
    del: async ({id}) => {
        const connection = db.getConnection();
        const  [ results ] = await connection.query(`SELECT stackId FROM ${MODEL_NAME} WHERE id = ?`, [id]);
        const stackId = _get(results, '0.stackId');
        if(!stackId) {
            throw Error(`not found ${MODEL_NAME} = ${id}`);
        }
        await dockerStack.rm(stackId);
        return await connection.query(`DELETE FROM ${MODEL_NAME} WHERE id = ?`, [id]);
    },
    list: async (pageNum, pageSize) => {
        const connection = db.getConnection();
        const [ projects ] = await connection.query(`SELECT * FROM ${MODEL_NAME}`);
        const allPromise = projects.map(p => dockerService.getServicesBy({stackId: p.stackId}));
        const projectServices = await Promise.all(allPromise);

        return projects.map((item, index) => {
            return {
                ...item,
                services: projectServices[index]
            }

        });
    }
}

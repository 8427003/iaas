const db = require('../helper/dbconnect');
const MODEL_NAME = 'project_template';

module.exports = {
    add: async (id, name, desc, author) => {
        const connection = db.getConnection();
        const now = new Date().getTime();
        const modelData = {
            id,
            name,
            desc,
            createTime: now,
            updateTime: now,
            author,
        }
        try {
            const [ result ] =  await connection.query(`INSERT INTO ${MODEL_NAME} SET ?`, modelData);
            return result;
        }
        catch (err) {
            console.error(err);
            throw new Error(err)
        }
    }
}

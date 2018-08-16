const db = require('../helper/dbconnect');
const MODEL_NAME = 'project_template';

module.exports = {
    add: async (id, name, desc, author, label, yamlData) => {
        const connection = db.getConnection();
        const now = Date.now();
        const modelData = {
            id,
            name,
            desc,
            createTime: now,
            updateTime: now,
            author,
            label,
            extra: yamlData ? JSON.stringify(yamlData) : null
        }
        const [ result ] =  await connection.query(`INSERT INTO ${MODEL_NAME} SET ?`, modelData);

        return result;
    },
    list: async () => {
        const connection = db.getConnection();

        const sqlList = `select * from project_template pt
                LEFT JOIN service_template st ON pt.id = st.project_template`

        const [ list ] =  await connection.query({ sql: sqlList, nestTables: true });
        const result = {};
        list.forEach(item => {
            const ptId = item.pt.id;
            !result[ptId] && (result[ptId] = item.pt || {});
            !result[ptId].services && (result[ptId].services = []);
            item.st && result[ptId].services.push(item.st);
        })

        return Object.values(result)
    },
    del: async id => {
        const connection = db.getConnection();
        const sql = `DELETE pt, st FROM project_template pt
            LEFT JOIN service_template st ON pt.id = st.project_template WHERE pt.id = ?`;

        return await connection.query(sql, [ id ]);
    },
    getDockerYAML: (projectTemplateData) => {
        const { services } = projectTemplateData;

        let servicesMap = {}
        services.reduce(map, item  => {
            map[item.name] = JSON.parse(item.extra);
            return map;
        }, servicesMap);
    }
}

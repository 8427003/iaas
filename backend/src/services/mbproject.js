const db = require('../common/helper/dbconnect');
const yaml = require('js-yaml');
const dockerStack = require('../dockerAPI/dockerStack');
const dockerService = require('../dockerAPI/dockerService');
const rmCustomPrefix = require('../common/utils/rmCustomPrefix');
const shortid = require('shortid');
const _get = require('lodash/get');
const MODEL_NAME = 'project';
const ObjectID = require('mongodb').ObjectID;

const projectService = {
    create: async ({ project, isTemplate }) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');
        const now = Date.now();
        const stackId = shortid.generate();

        delete project._id;

        const modelData = Object.assign(project, {
            _createTime: now,
            _updateTime: now,
            _status: 1,
            _stackId: isTemplate ? null : stackId,
            _isTemplate: isTemplate ? true : false
        });

        if(isTemplate) {
            return await collection.insertOne(modelData)
        }

        await collection.insertOne(modelData);
        try {
            const yamlData = rmCustomPrefix(project);
            return await dockerStack.deployWrap(yamlData, stackId);
        }
        catch (err) {
            await collection.deleteOne({
                _stackId: stackId
            })
            throw err;
        }
    },
    save: async ({ project }) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');
        const now = Date.now();
        const projectId = project._id;
        if(!projectId) {
            return;
        }
        const modelData = Object.assign(project, { _updateTime: now });
        delete modelData._id; // id 是枚举值，不能修改

        return await collection.updateOne({
            _id: new ObjectID(projectId),
        }, { $set : modelData })
    },
    del: async ({ projectId }) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');
        const projectInfo = await collection.findOne({
            _id: new ObjectID(projectId)
        }, {
            projection: {
                _stackId: 1
            }
        })
        const _stackId = _get(projectInfo, '_stackId');
        if(_stackId) {
            await dockerStack.rm(_stackId);
            await collection.deleteOne({
                _id: new ObjectID(projectId)
            })
        }
        return true;
    },
    list: async (pageNum, pageSize) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');

        const projects = await collection.find({
            _stackId: {
                $exists: true
            },
            _isTemplate: false,

        }).sort({_createTime: -1}).toArray();

        const allPromise = projects.map(p => dockerService.getServicesBy({stackId: p._stackId}));
        const projectServices = await Promise.all(allPromise);
        projectServices.filter(item => item).forEach((services, index) => {
            services.forEach(s => {
                const nameWithNamespace = _get(s, 'Spec.Name');
                const namespace = _get(s, ['Spec', 'Labels', 'com.docker.stack.namespace']);
                const name = nameWithNamespace.substr(namespace.length + 1);
                try {
                    projects[index].services[name]['_instance'] = s;
                }
                catch(e) {
                }
            })
        })

        return projects;
    },
    templateList: async (pageNum, pageSize) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');

        const projects = await collection.find({
            _isTemplate: true
        }).toArray();
        return projects;
    },
    inspect: async ({ projectId }) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');

        const projectInfo = await collection.findOne({
            _id: new ObjectID(projectId)
        })

        return projectInfo;
    },
    stop: async ({ projectId }) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');

        const projectInfo = await collection.findOne({
            _id: new ObjectID(projectId),
        }, {
            projection: {
                _stackId: 1
            }
        })
        const _stackId = _get(projectInfo, '_stackId');
        if(_stackId) {
            await dockerStack.rm(_stackId)
            return await collection.updateOne({
                _id: new ObjectID(projectId),
            }, {
                $set:{"_stackId": null}
            });
        }
    },
    restart: async ({ projectId, isForce }) => {
        const mgdb = await db.getMGConnection();
        const collection = mgdb.collection('project');
        if(isForce) {
            await projectService.stop({ projectId });
        }
        const projectInfo = await collection.findOne({
            _id: new ObjectID(projectId),
        })
        const _stackId = _get(projectInfo, '_stackId') || shortid.generate();
        const yamlData = rmCustomPrefix(projectInfo);
        await dockerStack.deployWrap(yamlData, _stackId)
        return await collection.updateOne({
            _id: new ObjectID(projectId),
        }, {
            $set:{"_stackId": _stackId}
        });
    }
}
module.exports = projectService;

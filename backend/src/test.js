const db = require('./common/helper/dbconnect');

async function main (){
    const mgdb = await db.getMGConnection();
    const collection = mgdb.collection('project');

    try{
        const r = await collection.insertMany([
            {a : 1}, {a : 2}, {a : 3}
        ]);
        console.log(r);
    }
    catch(e) {
        console.log(e);
    }

}
main();

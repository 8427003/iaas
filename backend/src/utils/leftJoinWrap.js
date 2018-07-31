module.exports = function (result, error) {
    if(error) {
        return;
    }
    if(!result) {
        return null;
    }

    if(Array.isArray(result)) {
        return result.map(item => {
            return mergeToFirstItem(item);
        })
    }
    return mergeToFirstItem(result)
}


// {a: {a:1}, b:{bb:1}} => {a:{aa:1, b: {bb:1}}
function mergeToFirstItem(obj, key) {
    let keys = Object.keys(obj || {}),
        firstKey = keys[0] || key;

    if(!firstKey) {
        return obj;
    }

    keys = keys.filter(item => item !== firstKey);

    keys.forEach(item => {
        obj[firstKey][item] = obj[item];
    })

    return obj[firstKey];
}


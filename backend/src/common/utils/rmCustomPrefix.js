const PREFIX = "_";

module.exports = function (obj) {
    const removedCustomString = JSON.stringify(obj, (k, v) => {
        if(0 === k.indexOf(PREFIX)) {
            return;
        }
        return v;
    })
    return JSON.parse(removedCustomString)
}

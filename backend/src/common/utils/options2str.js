// {a: 1, b:1} => "a 1 b 1"
module.exports = function(options) {
    const keys = Object.keys(options);
    let results = [];
    keys.forEach(key => {
        results.push(`${key} ${options[key]}`)
    })

    return results.join(' ');
}

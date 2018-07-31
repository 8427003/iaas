module.exports = function (result, error) {
    if(error) {
        return {
            error: {
                returnCode: -1,
                returnUserMessage: JSON.stringify(error),
                returnMessage: JSON.stringify(error),
            }
        }
    }
    return {
        error: {
            returnCode: 0,
            returnUserMessage: 'ok',
            returnMessage: 'ok',
        },
        data: result
    }
}


module.exports = function (result, error) {
    if(error) {
        if(typeof error === 'object') {
            error = error.toString();
        }
        console.error(error);
        return {
            error: {
                returnCode: -1,
                returnUserMessage: error,
                returnMessage: error,
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


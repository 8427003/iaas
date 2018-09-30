module.exports = function (result, error) {
    if(error) {
        if(typeof error === 'object' && (('code' in error) || ('msg' in error)) ) {
            return  {
                errorCode: error.code,
                errorMsg: typeof error === 'object' ? error.msg.toString() : error.msg,
            }
        }
        else if(typeof error === 'object'){
            error = error.toString();
        }

        return {
            errorCode: -1,
            errorMsg: error
        }
    }
    return {
        errorCode: 0,
        errorMsg: 'success',
        data: result
    }
}



class CommonController{
    async removeEmptyParams(body,type=null){
        Object.keys(body).forEach(function(key) {
            var val = body[key];
            if (val == null || val == '') {
                data[key] = null;
            }
        });
        return body;
    }
}

module.exports = new CommonController();

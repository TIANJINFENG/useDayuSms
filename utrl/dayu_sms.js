var unirest =  require("unirest");

var get_sms = function(data,strUrl,callback){
    console.log('11232132---------------')
    unirest.post(strUrl)
        .headers({
            'Content-Type': 'application/json'
        })
        .send(JSON.stringify(data))
        .end(function (response) {
            console.log('-----=============----------')
            var access = response.body;
            console.log(access)
            callback != undefined && callback(access.key);
            console.log("!!!!!!!!!!!!!!!!!");
            console.log(response.body);
            console.log("!!!!!!!!!!!!!!!!!")
        });
};
module.exports = get_sms;
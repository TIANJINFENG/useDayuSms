var AV = require('leanengine');
var TopClient = require('./sdk-dayu/lib/api/topClient.js').TopClient;
var dayu_sms = require('./utrl/dayu_sms.js');

AV.Cloud.onLogin(function(request, response) {
    console.log("on login:", request.object);
    if (new Date(request.object.get('password_term').iso).getTime()>new Date().getTime()) {
        response.success();
    } else {
        response.error('Forbidden');
    }
});
  //function timedMsg(id) {
  //    setTimeout(function(){
  //        var random_data = AV.Object.createWithoutData('_User', id);
  //        random_data.set('status_mima', '密码到期');
  //        random_data.save();
  //    },1000*60*20)
  //}

AV.Cloud.define('get_sms', function(request, response) {
    var data = JSON.stringify(Math.round(890000*Math.random()+100000));
    var time = new Date(new Date().getTime()+ 60000);
    var currentuser = new AV.Query('_User');
    currentuser.equalTo('username', 'w');
    currentuser.find().then(function (results) {
        console.log(results)
        var random_data = AV.Object.createWithoutData('_User', results[0].id);
        random_data.set('password', data);
        random_data.set('random_sms', data);
        random_data.set('password_term',  {"__type":"Date","iso":time.toISOString()});
        //timedMsg(results[0].id)
        random_data.save();
    })

    //var client = new TopClient({
    //
    //    'appkey': '23359740',
    //
    //    'appsecret': 'f3445247e30c0e9f110301d9aa2adb42',
    //
    //    'REST_URL': 'http://gw.api.taobao.com/router/rest'
    //
    //});
    //var rec_num = request.params.username
    //
    //client.execute('alibaba.aliqin.fc.sms.num.send', {
    //
    //    'extend':'',
    //
    //    'sms_type':'normal',
    //
    //    'sms_free_sign_name':'智能分诊',
    //
    //    'sms_param': JSON.stringify({code:data,product:'蚊子叮'}),
    //    'rec_num': rec_num,
    //    'sms_template_code':'SMS_7736083'
    //
    //}, function(error, response) {
    //
    //    if (!error) console.log(response);
    //
    //    else console.log(error);
    //
    //})
    response.success('发送成功')

});


module.exports = AV.Cloud;
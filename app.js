'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var todos = require('./routes/todos');
var AV = require('leanengine');
var ueditor = require("ueditor")


var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use("/", express.static('public'));

// 设置默认超时时间
app.use(timeout('15s'));

// 加载云函数定义
require('./cloud');
// 加载云引擎中间件
app.use(AV.express());

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//  extended: true
//}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.get('/', function(req, res) {
//  res.render('index', { currentTime: new Date() });
//});


app.use('/todos', todos);

app.get('/',function (req, res){
  res.redirect('/myApp/index.html')
})

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
//app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
//
//  // ueditor 客户发起上传图片请求
//
//  if(req.query.action === 'uploadimage'){
//
//    // 这里你可以获得上传图片的信息
//    var foo = req.ueditor;
//    console.log(foo.filename); // exp.png
//    console.log(foo.encoding); // 7bit
//    console.log(foo.mimetype); // image/png
//
//    // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
//    var img_url = 'yourpath';
//    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
//  }
//  //  客户端发起图片列表请求
//  else if (req.query.action === 'listimage'){
//    var dir_url = 'your img_dir'; // 要展示给客户端的文件夹路径
//    res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
//  }
//  // 客户端发起其它请求
//  else {
//
//    res.setHeader('Content-Type', 'application/json');
//    // 这里填写 ueditor.config.json 这个文件的路径
//    res.redirect('/ueditor/ueditor.config.json')
//  }}));

// error handlers
app.use(function(err, req, res, next) { // jshint ignore:line
  var statusCode = err.status || 500;
  if(statusCode === 500) {
    console.error(err.stack || err);
  }
  if(req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {}
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;

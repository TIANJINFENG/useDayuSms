'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var formidable = require('formidable');
var fs = require('fs');  //node.js核心的文件处理模块
//var file = require("../file.js");

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('Todo');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
    res.render('todos', {
    });
  }, function(err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('todos', {
        title: 'TODO 列表',
        todos: []
      });
    } else {
      next(err);
    }
});

router.post('/todos',function(req, res, next){
  //var tmp_path = req.files.thumbnail.path;
  //// 指定文件上传后的目录 - 示例为"images"目录。
  //var target_path = './public/upload/' + req.files.resource.name;
  //// 移动文件
  //fs.rename(tmp_path, target_path, function(err) {
  //  if (err) throw err;
  //  // 删除临时文件夹文件,
  //  fs.unlink(tmp_path, function() {
  //    if (err) throw err;
  //    res.send('File uploaded to: ' + target_path + ' - ' + req.files.resource.size + ' bytes');
  //  });
  //});
  var message = '';
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = 'public/upload/';     //设置上传目录
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }
    var filename = files.resource.name;
    // 对文件名进行处理，以应对上传同名文件的情况
    var nameArray = filename.split('.');
    var type = nameArray[nameArray.length-1];
    var name = '';
    for(var i=0; i<nameArray.length-1; i++){
      name = name + nameArray[i];
    }
    var rand = Math.random()*100 + 900;
    var num = parseInt(rand, 10);

    var avatarName = name + num +  '.' + type;

    var newPath = form.uploadDir + avatarName ;
    fs.renameSync(files.resource.path, newPath);  //重命名
  });
});
router.get('/download',function(req, res){
  console.log('----------wrew------------')
  var filepath = 'public/upload/file.txt';  // 文件存储的路径
//console.log(filepath)
  // filename:设置下载时文件的文件名，可不填，则为原名称
  res.download(filepath);
});

//// 新增 Todo 项目
//router.post('/', function(req, res, next) {
//  var content = req.body.content;
//  var todo = new Todo();
//  todo.set('content', content);
//  todo.save().then(function(todo) {
//    res.redirect('/todos');
//  }).catch(next);
//});

module.exports = router;

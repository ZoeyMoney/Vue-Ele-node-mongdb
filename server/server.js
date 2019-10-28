const express = require('express');
const app = express();
var jwt = require('jsonwebtoken');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express.Router();
app.use(require('cors')());
app.use(express.json());
//在服务器端建立uploads文件夹用来接受上传的文件，并将uploads文件夹托管为静态文件
app.use('/image',express.static(path.join(__dirname,'../image')));
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/Backstage",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:true});
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
//token
var jetToken = '123456';
//封装时间 年月日
function data (da) {
  var datas = new Date(da);
  var y = datas.getFullYear();
  var m = datas.getMonth() + 1;
  var d = datas.getDate();
  var dd = y+'-'+m+'-'+d;
  return dd;
}
//封装时间 年月日时分秒
function datam (data) {
  var data = new Date(data);
  var y = data.getFullYear();
  var m = data.getMonth() + 1;
  var d = data.getDate();
  var h = data.getHours();
  var yy = data.getMinutes();
  var dd = data.getSeconds();
  var datas = y+'-'+m+'-'+d+' '+h+':'+yy+':'+dd;
  return datas;
}


//登录注册账号密码
var UserPwd = mongoose.model('UserPwd',new mongoose.Schema({ name:String, password:String ,phone:Number, Email:String, age:Number,
  gender:String, ZhiYe:String, Date:String,UserName:String,token:String}));
//登录验证
app.post('/api/login',async (req,res)=>{
  var naArr = { name:req.body.name, password:req.body.password,token:req.body.token};
  var arr = { name : req.body.name};
  var token = jwt.sign(naArr,jetToken); //生成token
  var search = await UserPwd.find(arr);
  UserPwd.find(naArr,function (err, data) {
    if (data.length){
      res.send({ code:200, msg:'登录成功' ,search,token:token});
    }else{
      res.send({ code:201, msg:'用户名不存在或密码错误' });
    }
  });
});
//注册
app.post('/api/rdst',async (req,res)=>{
  var dates = req.body.Date;
  var arr = {
    name : req.body.name,
    password : req.body.password,
    phone : req.body.phone,
    Email : req.body.Email,
    age : req.body.age,
    gender : req.body.gender,
    ZhiYe : req.body.ZhiYe,
    UserName:req.body.UserName,
    Date:data(dates)
  }
  var arg = {name:arr.name}
  UserPwd.find(arg,async function (err, data) {
    if (data.length != ''){
      res.send({ code:201, msg:'已被注册' });
    }else{
      await UserPwd.create(arr);
      res.send({code:200,msg:'注册成功'});
    }
  });
});
//修改个人信息
app.post('/api/UserNameUpdate/:id',async (req,res)=>{
  var user = await UserPwd.findByIdAndUpdate(req.params.id,req.body);
  res.send({status: true});
});

//个人反馈
var UserFeeadback = mongoose.model('UserFdbck',new mongoose.Schema({ textarea:String, User:String, Email:String, phone:Number, date:String }))
app.post('/api/TextFabck',async (req,res)=>{
  var User = req.body.User;
  var phone = req.body.phone;
  var textarea = req.body.textarea;
  var Email = req.body.Email;
  var datas = req.body.date;
  var UserFeeadbacks = await UserFeeadback.create({ User:User, phone:phone, textarea:textarea, Email:Email, date:data(datas) });
  UserFeeadback.find(UserFeeadbacks,function (err, data) {
    if (data.length){
      res.send({ code:200, msg:'提交成功' });
    }else{
      res.send({ code:201, msg:'提交失败' });
    }
  });
});
//个人反馈查询
app.get('/api/FabckInquire',async (req,res)=>{
  var quire = await UserFeeadback.find();
  res.send(quire);
});

//删除
app.delete('/api/del/:id',async (req,res)=>{
  await UserFeeadback.findByIdAndRemove(req.params.id);
  res.send({status:true});
});
//查询个人信息
app.post('/api/UserNameSearch',async (req,res)=>{
  var pageSize = req.body.pageSize || 8;
  var page = req.body.page || 1;
  var total = await UserPwd.find();
  var totalLength = total.length;
  var search = await UserPwd.find().limit(Number(pageSize)).skip(Number((page - 1) * pageSize));
  res.send({search:search,total:totalLength});
});
//消费
var moneys = mongoose.model('money',mongoose.Schema({ name:String, Date:String, code:String, text:String, money: Number,DateY:String}));
//录入消费数据
app.post('/api/money',async (req,res)=>{
    var name = req.body.name;
    var dates = datam(req.body.Date);
    var code = req.body.code;
    var text = req.body.text;
    var money = req.body.money;
    var DateY = data(req.body.Date)
  var money = await moneys.create({name:name,Date:dates,code:code,text:text,money:money,DateY:DateY});
  moneys.find(money,async (err,data)=>{
    if (data.length) {
      res.send({code:200,msg:'录入成功'});
    }else{
      res.send({code:201,msg:'录入失败'});
    }
  })
});
//查询消费
app.post('/api/MoneySearch',async (req,res)=>{
  var pageSize = req.body.pageSize || 8; //设置默认值
  var page = req.body.page || 1; //默认第一页
  var total = await moneys.find() //查询多少条数据
  var totalLength = total.length  //统计多少条数据
  var search = await moneys.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize));
  res.send({search:search,total:totalLength})
});
//消费删除
app.delete('/api/deleteMoney/:id',async (req,res)=>{
  var del = await moneys.findByIdAndRemove(req.params.id)
  res.send({status:true})
})
//用户删除
app.delete('/api/delteUser/:id',async (req,res)=>{
  var del = await UserPwd.findByIdAndRemove(req.params.id)
  res.send({status:true})
})


//图片
//设置保存路径
var storage = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null,'../image');
  },
  //上传文件命名，获取添加后缀名
  filename:function (req, file, cb) {
    var exts = file.originalname.split('.');
    var ext = exts[exts.length-1];
    var tmname = (new Date()).getTime()+parseInt(Math.random()*999);
    cb(null,`${tmname}.${ext}`);
  }
});

//图片录入
var UserImage = mongoose.model('UserImage',mongoose.Schema({name:String,ImageName:String}))

var upload = multer({ storage:storage });
//single 图片的key值
app.post('/api/upload',upload.array('image',9), (req,res)=>{
  //多张图片上传
  var array = req.files;
  var arrSize = [];//大于500kb传进去
  for (var index in array){
    arrSize.push(array[index]);
    if (arrSize.length>0){
      var url = `/image/${array[index].filename}`;
      res.send({code:200,msg:'上传成功',url:url});
    }else{
      res.send({code:201,msg:'上传失败'})
    }
  }
//  单张图片上传
  /*  var {size,mimetype,path} = req.file;
    var types = ['jpg','jpeg','png','gif'];//类型
    var tmpType = mimetype.split('/')[1];
    if(size > 500000) {
      return res.send({code:201,msg:'尺寸过大'});
    }else if (types.indexOf(tmpType) == -1){
      return res.send({code:202,msg:'数据出错'});
    }else{
      var url = `/image/${req.file.filename}`
      res.send({code:200,msg:'提交成功',url:url});
    }*/
});
//读取文件图片
app.get('/api/uploadSearch', (req,res)=>{
  var components = [];
  var files = fs.readdirSync('../image');
  files.forEach(function (item, index) {
    components.push(item)
  })
  if (components.length>0){
    res.send({code:200,msg:'查询成功',data:components})
  }else{
    res.send({code:201,msg:'查询失败'})
  }
});

app.get('/',async (req,res)=>{
  res.send('index');
});


app.listen(8088,function () {
  console.log('http://localhost:8088');
});

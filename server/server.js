const express = require('express');
const app = express();
var router = express.Router();
app.use(require('cors')());
app.use(express.json());
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

//封装时间 年月日
function data (da) {
  var datas = new Date(da);
  var y = datas.getFullYear();
  var m = datas.getMonth() + 1;
  var d = datas.getDate();
  var dd = y+'-'+m+'-'+d
  return dd
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
  var datas = y+'-'+m+'-'+d+' '+h+':'+yy+':'+dd
  return datas
}
//登录注册账号密码
var UserPwd = mongoose.model('UserPwd',new mongoose.Schema({ name:String, password:String ,phone:Number, Email:String, age:Number,
  gender:String, ZhiYe:String, Date:String,UserName:String}));
//登录验证
app.post('/api/login',async (req,res)=>{
  var naArr = { name:req.body.name, password:req.body.password };
  var arr = { name : req.body.name};
  var search = await UserPwd.find(arr);
  UserPwd.find(naArr,function (err, data) {
    if (data.length){
      res.send({ code:200, msg:'登录成功' ,search});
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

app.get('/',async (req,res)=>{
  res.send('index');
});


app.listen(8088,function () {
  console.log('http://localhost:8088');
});

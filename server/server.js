const express = require('express');//接口
const app = express();
var jwt = require('jsonwebtoken');//加密
var multer = require('multer'); //图片存放
var path = require('path'); //路径
var fs = require('fs'); //文件操作
var mysql = require('mysql');//数据库
app.use(require('cors')());//跨域
app.use(express.json());//接收json格式
//在服务器端建立uploads文件夹用来接受上传的文件，并将uploads文件夹托管为静态文件
app.use('/image',express.static(path.join(__dirname,'../image')));
app.use('/netdisc',express.static(path.join(__dirname,'../netdisc')));
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
var upload = multer({ storage:storage });
//网盘
var storageNet = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null,'../netdisc');
  },
  filename:function (req, file, cb) {
    cb(null,`${file.originalname}`);
  }
});
var uploadNet = multer({ storage:storageNet });
// const mongoose = require('mongoose');
// mongoose.connect("mongodb://127.0.0.1/Backstage",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:true});
// mongoose.connect("mongodb://localhost/Backstage",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:true});


var db = mysql.createConnection({
  host:'localhost',
  port:'3306',
  user:'root',
  password:'root',
  database:'backstage'
});
db.connect();
var toens = '';
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
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
//登录验证
app.post('/api/login',(req,res)=>{
  var {name,password,token} = req.body;
  var token = jwt.sign({name:name},password,{expiresIn:60}); //生成token
  toens = token;
  var sql = `select * from userpwd where name = '${name}' and pwd = '${password}'`;
  db.query(sql,function (err, result) {
    if (err || result.length == 0){
      res.send({ code:201, msg:'用户名不存在或密码错误' });
    }else{
      res.send({ code:200, msg:'登录成功', search:result,token:token});
    }
  });
});
//注册
app.post('/api/rdst',(req,res)=>{
  var {name,password,Email,zhiye} = req.body;
  var findSql = `select * from userpwd where name='${name}'`;
  db.query(findSql,function (err, result) {
    if (result.length >0){
      res.send({ code:201, msg:'已被注册' });
    }else{
      var addSql = "insert into userpwd(name,pwd) values('"+name+"','"+password+"')";
      db.query(addSql,function (err, resultadd) {
        if (!err){
          res.send({code:200,msg:'注册成功'});
        }else{
          res.send({ code:202, msg:'注册失败' });
        }
      });
    }
  });
});
//修改个人信息
app.post('/api/UserNameUpdate',(req,res)=>{
  var {name,gender,age,phone,Email,ZhiYe,user_id} = req.body;
  ZhiYe = (ZhiYe =='' || ZhiYe==null || ZhiYe==undefined)?'无':ZhiYe;
  gender = (gender =='' || gender==null || gender==undefined)?'无':gender;
  age = (age =='' || age==null || age==undefined)?'无':age;
  phone = (phone =='' || phone==null || phone==undefined)?'无':phone;
  Email = (Email =='' || Email==null || Email==undefined)?'无':Email;
  var userpwdSql = `update userpwd set name='${name}' where user_id='${user_id}'`;
  db.query(userpwdSql,function (err, result) {
    if (!err){
      var usernamesSql = `update usernames set
          gender='${gender}',age='${age}',phone=${phone}
          ,Email='${Email}',zhiye='${ZhiYe}' where 
           user_id='${user_id}'`;
      db.query(usernamesSql,function (err, userResult) {
        if (!err){
          res.send({ status: true });
        }else{
          res.send({msg:'修改失败'});
        }
      });
    }else{
      console.log('err');
    }
  })
  // var updataSql = "update userpwd set name='"+name+"' where user_id='"+user_id+"'"; //修改userpwd表
  // var findSql = `select * from usernames where user_id='${user_id}'`; //查询usernames表
  // var updataSqlNames = `update usernames set gender='${gender}',age='${age}',phone='${phone}',Email='${Email}',zhiye='${zhiye}' where user_id='${user_id}'`;
  // var addSql = `insert into usernames(phone,Email,age,gender,zhiye,user_id) values('${phone}','${Email}','${age}','${gender}','${zhiye}','${user_id}')`;
});
//个人信息查询
app.post('/api/persone',(req,res)=>{
  var user_id = req.body;
  var selectSql = `select * from userpwd inner join usernames on userpwd.user_id = '${user_id.user_id}' where usernames.user_id='${user_id.user_id}'`;
  db.query(selectSql,function (err, result) {
    if (!err){
      res.send({code:200,msg:'查询成功',data:result});
    }else{
      res.send({code:201,msg:'程序出错'});
    }
  });
});

//个人反馈
app.post('/api/TextFabck',(req,res)=>{
  var {user_id,textarea} = req.body;
  var addSql = `insert into userfdbck(text,user_id) values ('${textarea}','${user_id}')`;
  db.query(addSql,function (err, result) {
    if (!err){
      res.send({ code:200, msg:'提交成功' });
    }else{
      res.send({ code:201, msg:'提交失败' });
    }
  });
  /*var User = req.body.User;
  var phone = req.body.phone;
  var textarea = req.body.textarea;
  var Email = req.body.Email;
  var datas = req.body.date;
  var UserFeeadbacks = await UserFeeadback.create({ User:User, phone:phone, textarea:textarea, Email:Email, date:data(datas) });
  UserFeeadback.find(UserFeeadbacks,function (err, data) {
    if (data.length){
      res.send({ code:200, msg:'提交成功' });
    }else{
       res.send({ code:200, msg:'提交成功' });
    }
  });*/
});
//个人反馈查询
app.get('/api/FabckInquire',(req,res)=>{
  var findSql = `select * from userpwd,usernames,userfdbck where userpwd.user_id=usernames.user_id and usernames.user_id = userfdbck.user_id`;
  db.query(findSql,function (err, result) {
    if (!err){
      res.send({ code:200, msg:'查询成功',result});
    }else{
      res.send({ code:201, msg:'查询失败' });
    }
  });
  /*var quire = await UserFeeadback.find();
  res.send(quire);*/
});

//删除反馈信息条
app.post('/api/del',(req,res)=>{
  var obj = req.body;
  var deleteSql = `delete from userfdbck where id='${obj.id}'`;
  //联级表删除
  //var deleteSql = `delete usernames,userfdbck from usernames,userfdbck where usernames.user_id='${id.user_id}' and userfdbck.user_id='${id.user_id}'`;
  db.query(deleteSql,function (err, result) {
    if (!err){
      res.send({status:true});
    }else{
      res.send({ code:201, msg:'删除失败'});
    }
  });
  /*await UserFeeadback.findByIdAndRemove(req.params.id);
  res.send({status:true});*/
});
//查询个人信息
app.post('/api/UserNameSearch',(req,res)=>{
  var pageNum = req.body.page || 1;
  var pageSize = req.body.pageSize || 8;
  var curen = (pageNum - 1) * pageSize;
  var search = `select * from userpwd left join usernames on userpwd.user_id=usernames.user_id limit ${curen},${pageSize}`;
  var len = `select * from userpwd`;
  db.query(search,function (err, result) {
    if (!err){
      db.query(len,function (err, lenResult) {
        if (!err){
          res.send({search:result,total:lenResult.length});
        }
      });
    }
  });
});
//消费
//录入消费数据
app.post('/api/money',(req,res)=>{
  var {name,date,code,text,money} = req.body;
  var findSql = `insert into money(name,Data,DateY,code,text,money) values('${name}','${date}','${data(date)}','${code}','${text}','${money}')`;
  db.query(findSql,function (err, result) {
    if (!err){
      res.send({code:200,msg:'录入成功'});
    }else{
      res.send({code:201,msg:'录入失败'});
    }
  });
});
//查询消费
app.post('/api/MoneySearch',(req,res)=>{
  var pageSize = req.body.pageSize || 8;
  var pageNum = req.body.page || 1;
  var curen = (pageNum - 1) * pageSize;
  var search = `select name,data,DateY,code,text,money,id from money limit ${curen},${pageSize}`;
  var len = `select name,data,DateY,code,text,money,id from money`;
  db.query(search,function (err, result) {
    if (!err){
      db.query(len,function (err, lenResult) {
        if (!err){
          res.send({search:result,total:lenResult.length});
        }else {
          res.send({code:201,msg:'查询失败'});
        }
      });
    }
  });
});
//消费删除
app.post('/api/deleteMoney',(req,res)=>{
  var {name,data,DateY,code,text,money,id} = req.body
  var deleteSql = `delete from money where id=${id}`;
  db.query(deleteSql,function (err, result) {
    if (!err){
      res.send({status:true})
    }
  });
  /*var del = await moneys.findByIdAndRemove(req.params.id)
  res.send({status:true})*/
});
//用户删除
app.post('/api/delteUser/:id',(req,res)=>{
  var id = req.params.id;
  var deleteSql = `delete userpwd,usernames from userpwd,usernames where userpwd.user_id=${id} and usernames.user_id=${id}`;
  db.query(deleteSql,function (err, result) {
    if (!err){
      res.send({status:true});
    }else{
      res.send({msg:'错误'});
    }
  });
});
//图片录入
//single 图片的key值
app.post('/api/upload',upload.array('image',9),async (req,res)=>{
  //多张图片上传
  var array = req.files;
  var datas = JSON.parse(req.body.data)
  var arrSize = [];//大于500kb传进去
  var imageArr = [];//图片命名储存
  for (var index in array){
    arrSize.push(array[index]);
    imageArr.push('http://localhost:8088/image/'+array[index].filename)
  }
  if (arrSize.length>0){
    var url = `${imageArr}`;
    var addSql = `insert into user_image(data_image,user_id,Data) values ('${JSON.stringify(imageArr)}','${datas.name}','${data(datas.data)}')`;
    db.query(addSql,function (err, result) {
      if (!err){
        res.send({code:200,msg:'上传成功',url:url});
      }
    });
    /*var cretd = await UserImage.create({name:datas.name,ImageName:JSON.stringify(imageArr),datam:datam(datas.data),date:data(datas.data)});
    UserImage.find(cretd,async (err,data)=>{
      if (data.length){
         res.send({code:200,msg:'上传成功',url:url});
      }
    });*/
  }else{
         res.send({code:201,msg:'上传失败'});
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
app.post('/api/uploadSearch',(req,res)=>{
  //查看本机静态所有图片
  var findSql = `select * from userpwd,user_image where userpwd.user_id=user_image.user_id`;
  db.query(findSql,function (err, result) {
    if (!err){
      var arr = result;
      arr.map(function (item) {
        item.data_image = JSON.parse(item.data_image);
        item.Data = data(item.Data);
      });
      res.send({code:200,msg:'查询成功',data:arr});
    }else{
      res.send({code:201,msg:'暂无数据'});
    }
  });
});
//image_all删除
app.post('/api/imageAllDel',async (req,res)=>{
  var data = req.body;
  var str = JSON.parse(data.ImageName);  //转数组
  str.forEach((item)=>{
    fs.unlink(`../image/${item}`,async (err)=>{
      if (err){
        console.log('err')
      }
    });
  });
  var components = [];  //本地图片
  var list = [];//匹配到的图片
    var files = fs.readdirSync('../image');
    files.forEach(function (item, index) {
      components.push(item);
    });
   for (var index in components){
     for (var i in str){
       if (components[index] == str[i]){
         list.push(components[i])
       }
     }
   }
   var deleteSql = `delete from user_image where id=${data.id}`;
   db.query(deleteSql,function (err, result) {
     if (!err){
       if (list.length>0){
         res.send({code:200,msg:'删除成功'})
       }else{
         res.send({code:201,msg:'删除失败'})
       }
     }
   });
});
//网盘录入
app.post('/api/netdisc',uploadNet.array('netdisc',9),async (req,res)=>{
  var file = req.files;
  var datas = JSON.parse(req.body.netdataName);
  for (var index in file){
    var addSql = `insert into user_netdisc(kb,file_href,net_find,user_id,Date) values ('${parseInt(file[index].size / 1024)}','${file[index].filename}','${"http://localhost:8088/netdisc/"+file[index].filename}','${datas.name}','${data(datas.data)}')`;
   await db.query(addSql,async function (err, result) {
      if (!err){
        res.send({code:200,msg:'保存成功'});
      }else{
        res.send({code:201,msg:'保存失败'});
      }
    });
  }
});
//网盘查询
app.get('/api/netFind',(req,res)=>{
  var find = `select * from userpwd,user_netdisc where userpwd.user_id=user_netdisc.user_id`;
  db.query(find,function (err, result) {
    if (!err){
      result.map(function (item) {
        item.Date = data(item.Date);
      });
      res.send({code:200,data:result});
    }else{
      res.send(({code:201,msg:'查询失败'}));
    }
  });
});
//网盘删除
app.post('/api/netDel',(req,res)=>{
  var {id,file_href} = req.body;
  var deleteSql = `delete from user_netdisc where id=${id}`;
  db.query(deleteSql,function (err, result) {
    if (!err){
      fs.unlink(`../netdisc/${file_href}`,(err)=>{
        if (err){
          res.send({code:201,msg:'删除失败'});
        }else{
          res.send({code:200,msg:'删除成功'});
        }
      });
    }else{
      res.send({code:201,msg:'数据异常'});
    }
  });
});
//公告编辑
app.post('/api/announcement',(req,res)=>{
  var {name,text,date,user_id,status} = req.body;
  var inserts = `insert into announcement(name,text,Data,user_id,status) values ('${name}','${text}','${date}','${user_id}','${status}')`;
  db.query(inserts,function (err, result) {
    if (err){
      res.send({code:201,msg:'发布失败'});
    }else{
      res.send({code:200,msg:'发布成功'});
    }
  })
});
//公告查询
app.get('/api/GetAnnouncement',(req,res)=>{
  var dbCreate = `CREATE TABLE announcement(
  id INT(11) NOT NULL AUTO_INCREMENT
  ,name VARCHAR(15) NOT NULL,
  text VARCHAR(255) NOT NULL,
  Data date NOT NULL,
  user_id INT(15) NOT NULL,
  status INT(1) NOT NULL,
  PRIMARY KEY(id))`;
  db.query(dbCreate,function (err, result) {
    if (!err){
      console.log('公告表创建成功');
    }
  });
  var sqlSelect = `select * from announcement`;
  db.query(sqlSelect,function (err, result) {
    if (err){
      res.send({code:201,data:'查询失败'});
    }else{
      result.map(function (item) {
        item.Data = data(item.Data);
      });
      res.send({code:200,data:result});
    }
  })
});
//公告修改
app.post('/api/Updataannouncement',(req,res)=>{
  var {id,name,text,Data,user_id,status} = req.body
  var UpdataSql = `update announcement set status=1 where id='${id}'`;
  db.query(UpdataSql,function (err, result) {
    if (!err){
      res.send({code:200,msg:'修改成功'});
    }else{
      res.send({code:201,msg:'修改失败'});
    }
  })
});

app.get('/',async (req,res)=>{
  res.send('index');
});

app.listen(8088,function () {
  console.log('http://localhost:8088');
});

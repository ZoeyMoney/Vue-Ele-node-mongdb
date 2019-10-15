<template>
  <div class="Login">
    <div class="bcg"></div>
    <div class="cg-img">
      <div class="box-show">
        <el-form ref="form" :model="sizeForm" label-width="80px" size="mini" v-show="sizeFormIf">
          <el-form-item label="账号">
            <el-input v-model="sizeForm.name" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="sizeForm.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="info" @click="onSubmit">登录</el-button>
          </el-form-item>
          <div class="box-btn">
            <div class="ifo" v-for="(item,i) in DateName" :key="i">
              <el-link type="info" @click="infoPwd(item.text)">{{item.text}}</el-link>
            </div>
          </div>
        </el-form>
        <el-form ref="form" :model="sizeFormDate" label-width="80px" size="mini" v-show="sizeGo">
          <el-form-item label="账号">
            <el-input v-model="sizeFormDate.name" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="sizeFormDate.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="sizeFormDate.UserName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="sizeFormDate.phone" placeholder="请输入手机"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="sizeFormDate.Email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="sizeFormDate.age" placeholder="请输入年龄"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="sizeFormDate.gender" placeholder="请输入性别"></el-input>
          </el-form-item>
          <el-form-item label="职业">
            <el-input v-model="sizeFormDate.ZhiYe" placeholder="请输入职业"></el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="info" @click="onSubmitadd">注册</el-button>
          </el-form-item>
          <div class="box-btn">
            <div class="ifo" v-for="(item,i) in UserName" :key="i">
              <el-link type="info" @click="infoPwds(item.text)">{{item.text}}</el-link>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../js/index'
export default {
  inject:['reload'],
  name: 'Login',
  data () {
    return {
      sizeForm: { name: '', password: '' },
      DateName:[{text:'注册账号'}, {text:'找回密码'}],
      sizeFormIf:true,
      sizeGo:false,
      sizeFormDate:{ name:'', password: '', phone:'', Email:'', age:'', gender:'', ZhiYe:'' ,Date:new Date(),UserName:''},  //注册
      UserName:[{text:'登录'}, {text:'找回密码'}]
    }
  },
  methods: {
    //登录
    onSubmit () {
      var then = this
      var _true = true
      if (this.sizeForm.name === '' || this.sizeForm.password === '') {
        this.$message.error('账号或密码不能为空')
        _true = false
        return false
      }
      this.axios.post('login', this.sizeForm).then(res => {
        if (res.status === 200){
          if (res.data.code == '200'){
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            sessionStorage.setItem(config.KEY.CACHE_LOGIN_NAME, this.sizeForm.name)
            sessionStorage.setItem('name', true)
            localStorage.UserName = JSON.stringify(res.data.search)
            then.$store.commit('name', this.sizeForm.name)
            then.$router.push({ path: '/Home' })
          } else if (res.data.code == '201'){
            this.$message.error(res.data.msg)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //注册
    onSubmitadd(){
      this.axios.post('rdst',this.sizeFormDate).then(res=>{
        if (res.status === 200) {
          if (res.data.code == '200'){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.reload()
          }else if (res.data.code == '201'){
            this.$message.error(res.data.msg)
          }
        }
      })
    },
    infoPwd(val){
      if (val == '注册账号'){
        this.sizeFormIf = false
        this.sizeGo = true
      }
    },
    infoPwds(val){
      if (val == '登录'){
        this.sizeFormIf = true
        this.sizeGo = false
      }
    }
  },
  created () {

  },
}
</script>

<style scoped>
  .bcg {position: fixed;z-index: 1000;background: url("../image/fb3a0ada95cb6321b0055c95f75aff8c.png") no-repeat;background-size: cover;width: 100%;height: 100%;}
  .cg-img{position: absolute;z-index: 99999;width: 100%;top: 25%;}
  .box-show{background: rgba(255,255,255,0.1);border: 1px solid rgba(255,255,255,0.2);width: 25%;margin: auto;padding-top: 74px;padding-bottom: 40px;padding-left: 24px;border-radius: 6px;}
  /deep/.el-form-item__label{color: #b6b6b6;}
  /deep/.el-input--mini .el-input__inner{line-height: 33px;height: 33px;}
  /deep/.el-input,/deep/.el-button{width: 80%;}
  /deep/.el-form-item{margin-bottom: 16px;}
  .box-btn{display: flex;width: 60%;padding-left: 87px}
  .box-btn .ifo{flex: 1}
  .box-btn .ifo:nth-child(2){text-align: right}
  .no{display: none}
  .ye{display: block}
  .cg-img:nth-child(2){
    top: 15%;
  }
  /*  .no{animation: no 1s linear;opacity: 0}
   .ye{opacity: 1;animation: ye 1s linear}
  @-webkit-keyframes no {
     0%{transform: rotateY(0deg);opacity: 1;}
     50%{transform: rotateY(60deg);opacity: 0.5;}
     100%{transform: rotateY(90deg);opacity: 0;}
   }
   @-webkit-keyframes ye {
     0%{transform: rotateY(0deg);opacity: 0}
     50%{transform: rotateY(60deg);opacity: 0.5}
     100%{transform: rotateY(90deg);opacity: 1}
   }*/
</style>

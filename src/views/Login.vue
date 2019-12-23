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
          <el-form-item label="验证码">
            <el-input v-model="sizeForm.code" style="width: 111px" placeholder="请输入验证码"></el-input>
            <el-tag style="margin-left: 10px" @click="rand">{{randmon}}</el-tag>
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
          <el-form-item label="验证码">
            <el-input v-model="sizeForm.code" style="width: 111px" placeholder="请输入验证码"></el-input>
            <el-tag style="margin-left: 10px" @click="rand">{{randmon}}</el-tag>
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
import RegExo from '../js/RegExp'
export default {
  inject: ['reload'],
  name: 'Login',
  data () {
    return {
      sizeForm: { name: '', password: '', code: '' },
      randmon: '',
      DateName: [{ text: '注册账号' }, { text: '找回密码' }],
      sizeFormIf: true,
      sizeGo: false,
      sizeFormDate: { name: '', password: '' }, // 注册
      UserName: [{ text: '登录' }, { text: '找回密码' }]
    }
  },
  methods: {
    // 登录
    onSubmit () {
      var then = this
      var _true = true
      if (RegExo.test(this.sizeForm.name) || RegExo.test(this.sizeForm.password)) {
        this.$message.error('账号或密码错误')
        _true = false
        return false
      }
      if (this.sizeForm.name === '' || this.sizeForm.password === '') {
        this.$message.error('账号或密码不能为空')
        this.randnumber()
        _true = false
        return false
      }
      if (this.sizeForm.code === '') {
        this.$message.error('验证码不能为空')
        this.randnumber()
        this.sizeForm.password = ''
        _true = false
        return false
      }
      if (this.sizeForm.code.toUpperCase() !== this.randmon) {
        this.$message.error('验证码错误')
        this.randnumber()
        _true = false
        return false
      }
      this.axios.post('login', this.sizeForm).then(res => {
        if (res.status === 200) {
          if (res.data.code == '200') {
            this.$message({ message: res.data.msg, type: 'success' })
            var user_id = ''
            for (var index in res.data.search) {
              user_id += res.data.search[index].user_id
            }
            this.randnumber()
            sessionStorage.setItem(config.KEY.CACHE_LOGIN_NAME, this.sizeForm.name)
            sessionStorage.setItem('name', true)
            sessionStorage.setItem(config.KEY.CACHE_USER_ID, user_id)
            sessionStorage.setItem('user_id', true)
            localStorage.UserName = JSON.stringify(res.data.search)
            sessionStorage.setItem(config.KEY.CACHE_LOGIN_TOKEN, res.data.token)
            then.$store.commit('name', this.sizeForm.name)
            then.$store.commit('user_id', user_id)
            then.$router.push({ path: '/Home' })
          } else if (res.data.code == '201') {
            this.$message.error(res.data.msg)
            this.randnumber()
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 注册
    onSubmitadd () {
      var _true = true
      var patt = new RegExp(/\s+/g)
      if (patt.test(this.sizeFormDate.name) || patt.test(this.sizeFormDate.password) || patt.test(this.sizeFormDate.phone) ||
        patt.test(this.sizeFormDate.Email) || patt.test(this.sizeFormDate.age) || patt.test(this.sizeFormDate.gender)) {
        this.$message.error('其中格式有误')
        _true = false
        return false
      }
      if (this.sizeFormDate.name == '') {
        this.$message.error('用户名不能为空')
        _true = false
        return false
      }
      if (this.sizeFormDate.password == '') {
        this.$message.error('密码不能为空')
        _true = false
        return false
      }
      this.axios.post('rdst', this.sizeFormDate).then(res => {
        if (res.status === 200) {
          if (res.data.code == '200') {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.reload()
          } else if (res.data.code == '201') {
            this.$message.error(res.data.msg)
          }
        }
      })
    },
    infoPwd (val) {
      if (val == '注册账号') {
        this.sizeFormIf = false
        this.sizeGo = true
        this.randnumber()
      }
    },
    infoPwds (val) {
      if (val == '登录') {
        this.sizeFormIf = true
        this.sizeGo = false
        this.randnumber()
      }
    },
    //  随机数
    randnumber () {
      var len = 4
      var txt = ''
      var code = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')
      for (var i = 0; i < len; i++) {
        var ssc = Math.floor(Math.random() * 36)
        txt += code[ssc]
      }
      this.randmon = txt
    },
    //  局部刷新
    rand () {
      this.randnumber()
    }
  },
  created () {
    this.randnumber()
  }
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

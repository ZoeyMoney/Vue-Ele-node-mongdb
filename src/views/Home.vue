<template>
    <div class="Home">
      <el-container style="height: 100vh;">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu :default-openeds="['1','2']" @select="handleSelect" :collapse="isCollapse">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-date"></i>
                <span>信息统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">信息反馈</el-menu-item>
                <el-menu-item index="1-2">日常消费</el-menu-item>
                <el-menu-item index="1-3">用户统计</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-picture"></i>
                <span>精彩瞬间</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">图片分享</el-menu-item>
                <el-menu-item index="2-2">网盘</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header style="text-align: left; font-size: 12px">
            <el-menu
              :default-active="activeIndex2"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelects"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <h1 style="float: left;padding-left: 13px;color: white"><i class="el-icon-s-home home"></i>Home{{catalog}}</h1>
              <el-submenu index="1">
                <template slot="title"><i class="el-icon-setting"></i>{{name}}</template>
                <el-menu-item index="1-2">个人信息</el-menu-item>
                <el-menu-item index="1-1">个人反馈</el-menu-item>
                <el-menu-item index="1-3">退出账户</el-menu-item>
              </el-submenu>
              <el-menu-item index="2">公告</el-menu-item>
            </el-menu>
          </el-header>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
      <div class="posav" v-show="box_input">
        <el-card class="box-card box-input">
          <div slot="header" class="clearfix">
            <span style="font-size: 15px;font-weight: 600">反馈</span>
            <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="box_input=false"></i></el-button>
          </div>
          <div class="text item">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-input type="textarea" :rows="5"  placeholder="反馈内容" v-model="formInline.textarea" resize="none"></el-input>
            </el-form>
            <div class="btn">
              <el-button type="info" @click="info">提交</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div class="posav" v-show="one_ge">
        <el-card class="box-card box-input">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
            <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="one_ge=false"></i></el-button>
          </div>
          <div class="text item">
            <el-form :inline="true" :model="formData" class="demo-form-inline">
              <el-input v-model="formData.name" placeholder="name"></el-input>
              <el-input v-model="formData.gender" placeholder="性别"></el-input>
              <el-input v-model="formData.age" placeholder="年龄"></el-input>
              <el-input v-model="formData.phone" placeholder="电话"></el-input>
              <el-input v-model="formData.Email" placeholder="邮箱"></el-input>
              <el-input v-model="formData.ZhiYe" placeholder="职业"></el-input>
              <div class="btn">
                <el-button type="primary" @click="add(formData._id)">修改</el-button>
              </div>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
</template>

<script>
import config from '../js/index'
export default {
  inject: ['reload'],
  name: 'Home',
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      name: sessionStorage.getItem(config.KEY.CACHE_LOGIN_NAME),
      box_input: false,
      formInline: {
        textarea: '',
        user_id: sessionStorage.getItem(config.KEY.CACHE_USER_ID)
      },
      one_ge: false,
      formData: {
        name: '', // 名字
        gender: '', // 性别
        age: '', // 年龄
        phone: '', // 手机号
        Email: '', // 邮箱
        ZhiYe: '', // 职业
        user_id: sessionStorage.getItem(config.KEY.CACHE_USER_ID)
      },
      catalog: '/Feedback', // 目录
      isCollapse: false
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      switch (key) {
        case '1-1':
          this.catalog = '/Feedback'
          this.$router.push('/Feedback')
          break
        case '1-2':
          this.catalog = '/table'
          this.$router.push('/table')
          break
        case '1-3':
          this.catalog = '/UserName'
          this.$router.push('/UserName')
          break
        case '2-1':
          this.catalog = '/image_all'
          this.$router.push('/image_all')
          break
        case '2-2':
          this.catalog = '/netdisc'
          this.$router.push('/netdisc')
      }
    },
    handleSelects (key) {
      switch (key) {
        case '1-1':
          this.box_input = true
          break
        case '1-2':
          var user_id = { user_id: sessionStorage.getItem(config.KEY.CACHE_USER_ID) }
          this.axios.post('persone', user_id).then(res => {
            for (var index in res.data.data) {
              this.formData.name = res.data.data[index].name
              this.formData.gender = res.data.data[index].gender
              this.formData.age = res.data.data[index].age
              this.formData.phone = res.data.data[index].phone
              this.formData.Email = res.data.data[index].Email
              this.formData.ZhiYe = res.data.data[index].zhiye
            }
          })
          this.one_ge = true
          break
        case '1-3':
          sessionStorage.clear()
          this.$router.push({ path: '/' })
          break
        case '2':
          console.log('2')
          break
      }
    },
    //  个人反馈提交
    info () {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      var mEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      var _true = true
      // 反馈内容
      if (this.formInline.textarea == '') {
        this.$message.error('反馈内容不能为空')
        _true = false
        return false
      }
      this.axios.post('TextFabck', this.formInline).then(res => {
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
    //  个人信息保存
    add (id) {
      var _true = true
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/ // 手机号
      var nameReg = /^[\u4E00-\u9FA5]{2,10}$/ // 验证人的名字
      var mEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ // 邮箱
      var patt = new RegExp(/\s+/g)
      if (patt.test(this.formData.name) || patt.test(this.formData.gender) || patt.test(this.formData.age) || patt.test(this.formData.phone) ||
      patt.test(this.formData.Email)) {
        this.$message.error({
          message: '格式错误',
          type: 'warning'
        })
        _true = false
        return false
      }
      // 验证名字
      if (this.formData.name == '') {
        this.$message.error({
          message: '姓名不能为空',
          type: 'warning'
        })
        _true = false
        return false
      }
      /* if (!nameReg.test(this.formData.name)){
         this.$message({
           message: '姓名格式错误',
           type: 'warning'
         });
         _true = false
         return false
       } */
      // 性别
      if (this.formData.gender != '男' && this.formData.gender != '女') {
        this.$message({
          message: '性别错误',
          type: 'warning'
        })
        _true = false
        return false
      }
      // 年龄
      if (this.formData.age == '') {
        this.$message.error({
          message: '邮箱不能为空',
          type: 'warning'
        })
        _true = false
        return false
      }
      if (this.formData.age.length == '3') {
        this.$message({
          message: '性别不能超过3个字',
          type: 'warning'
        })
        _true = false
        return false
      }
      // 验证手机号
      if (this.formData.phone == '') {
        this.$message.error({
          message: '手机号不能为空',
          type: 'warning'
        })
        _true = false
        return false
      }
      if (!myreg.test(this.formData.phone)) {
        this.$message({
          message: '手机格式错误',
          type: 'warning'
        })
        _true = false
        return false
      }
      // 邮箱
      if (this.formData.Email == '') {
        this.$message.error({
          message: '邮箱不能为空',
          type: 'warning'
        })
        _true = false
        return false
      }
      if (!mEmail.test(this.formData.Email)) {
        this.$message({
          message: '邮箱格式错误',
          type: 'warning'
        })
        _true = false
        return false
      }
      this.axios.post('UserNameUpdate', this.formData).then(res => {
        if (res.status === 200) {
          if (res.data.status == true) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            sessionStorage.setItem(config.KEY.CACHE_LOGIN_NAME, this.formData.name)
            this.$store.commit('name', this.formData.name)
            this.reload()
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    }
  /*  wx(){
      var pc = '';

     var set =  setInterval(()=>{
        pc = document.body.clientWidth
      },1000)
      console.log(pc)
    } */
  },
  created () {

  },
  computed: {

  }
}
</script>

<style scoped>
  /deep/.el-header {background-color: #B3C0D1;color: #333;line-height: 60px;}
  /deep/.el-aside {color: #333;}
  /deep/.el-header{padding: 0;}
  /deep/.el-menu--horizontal>.el-submenu{float: right;}
  /deep/.el-menu-item{float: right}
  /deep/.el-menu-item-group__title{padding: 0;}
  /deep/.text {font-size: 14px;}
  /deep/.item {margin-bottom: 0;}
  /deep/.clearfix:before, .clearfix:after {display: table;content: "";}
  /deep/.clearfix:after {clear: both}
  /deep/.box-card {width: 480px;}
  /deep/.box-input{position: absolute;top: 17%;left: 35%;}
  /deep/.el-card__header{padding: 11px 20px;}
  .posav{position: absolute;width: 100%;height: 100%;top: 0;background-color: rgba(89, 89, 89, 0.6);z-index: 999;}
  /deep/.el-button--info{margin-top: 12px;padding: 9px 44px;}
  .btn{text-align: center;}
  /deep/.el-input{margin-bottom: 12px;}
  .item /deep/.el-input__inner{height: 32px;}
  /deep/.el-main{padding: 0;}
  .home{font-size: 21px;}
  /deep/.el-badge__content.is-fixed{top: 11px}
  /*/deep/.item{width: 180px;overflow: hidden;text-overflow: ellipsis}*/
  /*@media (max-width: 768px) {

  }*/
</style>

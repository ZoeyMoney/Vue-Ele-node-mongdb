<template>
    <div class="annouEdit">
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入公告内容" v-model="textarea2" resize="none"></el-input>
      <div class="success">
        <el-button type="success" @click="onSubmit">发布内容</el-button>
      </div>
    </div>
</template>

<script>
  import config from '../js/index'
  export default {
    name: 'annouEdit',
    data(){
      return{
        textarea2: ''
      }
    },
    methods: {
      onSubmit() {
        var text = {name:sessionStorage.getItem(config.KEY.CACHE_LOGIN_NAME),text:this.textarea2,date:new Date(),user_id: sessionStorage.getItem(config.KEY.CACHE_USER_ID),status:0}
        this.axios.post('announcement',text).then(res=>{
          if (res.status === 200){
            if (res.data.code === 200){
              this.$message({message:res.data.msg,type:'success'});
              this.$router.push('/announcement');
            }else{
              this.$message.error(res.data.msg);
            }
          }else{
            this.$message.error('数据异常');
          }
        });
      }
    }
  }
</script>

<style scoped>

  /deep/.el-textarea__inner{height: 208px!important;}
  .success{text-align: center;margin-top: 10px;margin-right: 10px}
</style>

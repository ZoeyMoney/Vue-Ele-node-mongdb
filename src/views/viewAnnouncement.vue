<template>
    <div class="viewAnnouncement">
      <el-container>
        <el-header>name：{{text.name}}</el-header>
        <el-main>
          内容：{{text.text}}
        </el-main>
      </el-container>
    </div>
</template>

<script>
  export default {
    name: 'viewAnnouncement',
    data(){
      return{
        text:''
      }
    },
    methods:{
      receive(){
        this.text = JSON.parse(this.$route.params.id);
      }
    },
    created () {
      this.receive();
    }
  }
</script>

<style scoped>
.viewAnnouncement{text-align: center}
  /deep/.el-header{border-bottom: 1px solid #b3c0d1;background-color: transparent}
  /deep/.el-main{text-align: left;text-indent:2rem;padding-top: 10px;line-height: 26px}
</style>

<template>
    <div class="image_all">
      <div class="upload-img">
        <div class="btn-img">
          <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="box-upload">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0;font-size: 14px" type="text"><i class="el-icon-close"></i></el-button>
          </div>
          <div class="text item">
            <el-upload
              action="http://localhost:8088/api/upload"
              multiple
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-change="listChange"
              :auto-upload="false"
              :file-list="fileList"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <div class="btn-primary">
            <el-button type="primary" @click="add_img">提交</el-button>
          </div>
        </el-card>
      </div>
      <div class="arr">
        <div class="arr-img">
          <el-image :src="src">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'image_all',
    data(){
      return{
        img_href:require('../image/14e7bcb312b0f35534655122ca6b8a02.jpg'),
        src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        dialogImageUrl: '',
        dialogVisible: false,
        fileList:[]
      }
    },
    methods:{
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      listChange(file){
        this.dialogImageUrl = file.url
        console.log(this.dialogImageUrl)
        this.fileList.push(file.raw)
      },
      add_img(){
        console.log(this.fileList)
        /*var formdata = new FormData() //创建空的formdata
        formdata.append('image',this.dialogImageUrl)
        this.axios.post('upload',formdata).then(res=>{
          console.log(res)
        })*/
      }
    },
    created () {

    }
  }
</script>

<style scoped>
.upload-img{
  text-align: right;
  padding-right: 23px;
  line-height: 57px;
}
  .arr-img{
    width: 300px;
    height: 200px;
  }
/deep/.text {
  font-size: 14px;
}

/deep/.item {
  margin-bottom: 18px;
}

/deep/.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
/deep/.clearfix:after {
  clear: both
}

/deep/.box-card {
  width: 480px;
}
/deep/ .el-card__header{
    padding: 7px 20px;
  font-size: 14px;
}
  /deep/.box-card{
    width: 519px;
    margin: auto;
  }
  .btn-primary{
    text-align: right;
  }

</style>

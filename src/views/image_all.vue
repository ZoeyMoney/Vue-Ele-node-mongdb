<template>
    <div class="image_all">
      <div class="upload-img">
        <div class="btn-img">
          <el-button type="primary" @click="uploadStyle=true">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="box-upload" v-show="uploadStyle">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{name}}</span>
            <el-button style="float: right; padding: 3px 0;font-size: 14px" type="text" @click="uploadStyle=false"><i class="el-icon-close"></i></el-button>
          </div>
          <div class="text item">
            <el-upload
              class="upload-demo"
              multiple
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="listChange"
              :file-list="fileList"
              :auto-upload="false"
              :limit="number"
              list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div class="btn-primary">
            <el-button type="primary" @click="add_img">提交</el-button>
          </div>
        </el-card>
      </div>
      <div class="arr" id="arrId">
        <el-row  v-show="ListImage != '' || ListImage !=undefined ||ListImage!=null">
          <el-col>
            <el-card :body-style="{ padding: '0px' }" v-for="(item,i) in ListImage" :key="i" shadow="hover">
              <div class="img-hover">
                <el-image v-for="(items,index) in item.data_image" :src="items" :key="index"></el-image>
              </div>
              <div style="padding: 14px;">
                <span><b style="font-size: 14px">用户名：</b>{{item.name}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.Data }}</time>
                  <el-button type="text" class="button" @click="del(item)">删除</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="undfined" v-show="ListImage == '' || ListImage == undefined || ListImage == null">
          空
        </div>
      </div>
    </div>
</template>

<script>
import config from '../js/index'
export default {
  inject: ['reload'],
  name: 'image_all',
  data () {
    return {
      img_href: require('../image/14e7bcb312b0f35534655122ca6b8a02.jpg'),
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      dialogVisible: false,
      fileList: [],
      uploadStyle: false,
      number: 9,
      name: sessionStorage.getItem(config.KEY.CACHE_LOGIN_NAME),
      ListImage: '',
      arrImg: ''
    }
  },
  methods: {
    handleRemove (file, fileList) {
      this.fileList.some((item, i) => {
        if (item.name == file.name) {
          this.fileList.splice(i, 1)
          return true
        }
      })
    },
    handlePictureCardPreview (file) {
      /* this.dialogImageUrl = file.url;
        this.dialogVisible = true; */
    },
    listChange (file) {
      this.fileList.push(file)
    },
    add_img () {
      var _true = true
      var then = this
      var arr = [] // 筛选raw
      var miteType = ['jpg', 'jpeg', 'png', 'gif'] // 判断后缀
      var arrIndex = []// 截取后缀名
      for (var index in this.fileList) {
        arr.push(this.fileList[index].raw)
      }
      for (var index in arr) {
        // 判断大小
        if (arr[index].size > 2000000000) {
          this.$message.error('图片过大')
          _true = false
          return false
        }
        //  判断后缀名
        if (miteType.indexOf(arr[index].type.split('/')[1]) == -1) {
          this.$message.error('图片格式有错')
          _true = false
          return false
        }
      }
      var formdata = new FormData() // 创建空的formdata
      for (var index in this.fileList) {
        formdata.append('image', this.fileList[index].raw)
      }
      var data = { name: sessionStorage.getItem(config.KEY.CACHE_USER_ID), data: new Date() }
      formdata.append('data', JSON.stringify(data))
      this.axios.post('upload', formdata).then(res => {
        if (res.status === 200) {
          if (res.data.code == 200) {
            this.$message({ message: res.data.msg, type: 'success' })
            this.reload()
          } else if (res.data.code == 201) {
            this.$message.error({ message: res.data.msg })
          }
        }
      })
    },
    //  图片查询
    uploadSearch () {
      this.axios.post('uploadSearch').then(res => {
        if (res.data.code === 200) {
          this.ListImage = res.data.data
          function sorts (a, b) {
            return Date.parse(b.DateS) - Date.parse(a.DateS)
          }
          this.ListImage.sort(sorts)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //  图片解析
    getImage (val) {
      var image = 'http://localhost:8088/image/' + val
      return image
    },
    // 删除
    del (val) {
      var data = val.data_image
      var srt = data.join('')
      var str = srt.split('http://localhost:8088/image/')
      for (var i = 0; i < str.length; i++) {
        if (str[i] == '' || str[i] == null || typeof (str[i]) === 'undefined') {
          str.splice(i, 1)
          i = i - 1
        }
      }
      var vals = { ImageName: JSON.stringify(str), datam: val.datam, date: val.date, name: val.name, id: val.id }
      this.axios.post('imageAllDel', vals).then(res => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message({ message: res.data.msg, type: 'success' })
          } else {
            this.$message.error(res.data.msg)
          }
        }
        this.reload()
      })
    }
  },
  created () {
    this.uploadSearch()
  },
  computed: {

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
/deep/ .el-card__header{
    padding: 7px 20px;
  font-size: 14px;
}
  /deep/.box-card{
    width: 456px;
    margin: auto;
  }
  .btn-primary{
    text-align: right;
  }

/deep/.el-upload--picture-card,/deep/.el-upload-list--picture-card .el-upload-list__item{
  width: 130px;
  height: 130px;
}
  .box-upload{
    background-color: rgba(188, 188, 188, 0.6);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
  }
  /deep/.el-image{
    width: 87px;
    height: 87px;
    margin-left: 7px;
  }
  .undfined{
    text-align: center;
    color: #b6b6b6;
  }

/deep/.time {
  font-size: 13px;
  color: #999;
}

/deep/.bottom {
  line-height: 12px;
}

/deep/.button {
  padding: 0;
  float: right;
}

/deep/.image {
  width: 100%;
  display: block;
}

/deep/.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}

/deep/.clearfix:after {
  clear: both
}
  /deep/.el-col-8{
    width: 15.33333%;
  }
  /deep/.el-col-offset-2{
    margin-left: 2.33333%;
  }
  /deep/.is-hover-shadow{
    float: left;
    width: 95%;
    break-inside: avoid;
    box-sizing: border-box;
    margin-bottom: 10px;
    margin-left: 10px;
  }
  /deep/.img-hover{
    padding: 10px;
  }
  /deep/.el-col-24{
    column-count: 4;
    column-gap: 0;
  }

</style>

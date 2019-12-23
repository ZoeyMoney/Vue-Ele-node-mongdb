<template>
    <div class="netdisc">
      <div class="top" v-show="fix">
        <el-card class="box-card box-input">
          <div slot="header" class="clearfix">
            <span><b>友情提示</b></span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="fix = false"><i class="el-icon-close"></i></el-button>
          </div>
          <div class="text item">
            尽量配合使用IDM下载、这样可以让效果得到最佳，将网速提至最大，可以快速完成需要下载的项目。如果有好东西希望可以分享出来。
            (至于为什么要用IDM下载，可自行百度)推荐软件：IDM（可以将本电脑网速所有线程拉取到IDM从而达到下载最快速，可谓下载神器。）<br/>
            <a class="idm" href="http://mirror2.internetdownloadmanager.com/idman635build12.exe?b=1&filename=idman635build12.exe">IDM下载地址</a>
            <el-button type="primary">主要按钮</el-button>
          </div>
        </el-card>
      </div>
      <div class="btn">
        <el-button type="primary" size="small" @click="box_div = true">新建上传</el-button>
      </div>
      <div class="centent" v-show="box_div">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button style="float: right; padding: 3px 0" type="text" @click="closes"><i class="el-icon-close"></i></el-button>
          </div>
          <div class="text item">
             <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :on-remove="handleRemove"
          multiple
          :auto-upload="false"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
            <el-button style="margin-left: 10px;float: right;margin-bottom: 20px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </div>
        </el-card>
      </div>
      <div class="table">
        <template>
          <el-table :data="tableData" style="width: 100%;height: 100vh">
            <el-table-column fixed prop="Date" label="日期" width="150"></el-table-column>
            <el-table-column prop="name" label="昵称" width="120"></el-table-column>
            <el-table-column prop="kb" label="大小(KB)" width="120"></el-table-column>
            <el-table-column prop="file_href" label="文件名称" width="400"></el-table-column>
            <el-table-column prop="net_find" label="下载地址" width="400"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
</template>

<script>
import config from '../js/index'
export default {
  name: 'netdisc',
  inject: ['reload'],
  data () {
    return {
      fix: true,
      box_div: false,
      fileList: [],
      tableData: [],
      name: sessionStorage.getItem(config.KEY.CACHE_LOGIN_NAME)
    }
  },
  methods: {
    handleChange (file, fileList) {
      this.fileList.push(file)
    },
    deleteRow (index, rows) {
      this.axios.post('netDel', rows).then(res => {
        if (res.status === 200) {
          if (res.data.code == 200) {
            this.$message({ message: res.data.msg, type: 'success' })
            this.reload()
          } else {
            this.$message.error(res.data.msg)
          }
        } else {
          this.$message.error('数据异常')
        }
      })
    },
    // 关闭
    closes () {
      this.box_div = false
      this.$store.commit('netdisc', config.KEY.CACHE_NETDISC)
      console.log(config.KEY.CACHE_NETDISC)
    },
    handleRemove (file, fileList) {
      this.fileList.some((item, i) => {
        if (item.name == file.name) {
          this.fileList.splice(i, 1)
          return true
        }
      })
    },
    submitUpload () {
      var then = this
      var _true = true
      if (this.fileList == '') {
        this.$message.error('内容不能为空')
        _true = false
        return false
      }
      var formdata = new FormData()// 创建空的formdata
      for (var index in this.fileList) {
        formdata.append('netdisc', this.fileList[index].raw)
      }
      var name = { name: sessionStorage.getItem(config.KEY.CACHE_USER_ID), data: new Date() }
      formdata.append('netdataName', JSON.stringify(name))
      this.axios.post('netdisc', formdata).then(res => {
        if (res.status === 200) {
          if (res.data.code == 200) {
            this.$message({ message: res.data.msg, type: 'success' })
            this.reload()
            this.fix = false
          } else {
            this.fix = false
            this.$message.error(res.data.msg)
          }
        } else {
          this.fix = false
          this.$message.error('数据异常')
        }
      })
    },
    // 查询
    find () {
      this.axios.get('netFind').then(res => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.tableData = res.data.data
          } else if (res.data.code === 201) {
            this.$message.error('查询失败或无数据')
          }
        } else {
          this.$message.error('数据异常')
        }
      })
    }

  },
  created () {
    this.find()
  }
}
</script>

<style scoped>
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
    position: absolute;
    left: 35%;
    top: 22%;
  }
  .top{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: rgba(89, 89, 89, 0.6);
    z-index: 1000;
    height: 100%;
  }
  .box-input{
    position: absolute;
    top: 17%;
    left: 35%;
  }
  .centent{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    height: 100vh;
    background-color: rgba(108, 108, 108, 0.6);
  }
  .el-upload-list{
    padding-bottom: 10px;
  }
</style>

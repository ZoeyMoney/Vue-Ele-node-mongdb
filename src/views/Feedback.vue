<template>
  <div>
    <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="名字" width="180"></el-table-column>
      <el-table-column prop="phone" label="联系方式" width="180"></el-table-column>
      <el-table-column prop="Email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="text" label="反馈内容" width="380"></el-table-column>
      <el-table-column label="日期" width="180">
        <template slot-scope="scope">{{ data(scope.row.data) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click.native.prevent="deleteRow(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="posav" v-show="box_input">
    <el-card class="box-card box-input">
      <div slot="header" class="clearfix">
        <span style="font-size: 15px;font-weight: 600">反馈详情</span>
        <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="box_input=false"></i></el-button>
      </div>
      <div class="text item">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" :disabled="true">
          <el-input v-model="formInline.User" placeholder="名字"></el-input>
          <el-input v-model="formInline.phone" placeholder="电话"></el-input>
          <el-input v-model="formInline.Email" placeholder="邮箱"></el-input>
          <el-input type="textarea" :rows="5"  placeholder="反馈内容" v-model="formInline.textarea" resize="none"></el-input>
        </el-form>
      </div>
    </el-card>
    </div>
  </div>
</template>

<script>
import config from '../js/index'
export default {
  name: 'Feedback',
  inject: ['reload'],
  data () {
    return {
      tableData: [],
      box_input: false,
      formInline: {
        phone: '',
        text: '',
        Email: '',
        name: '',
        data: ''
      }
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // 查询信息
    quire () {
      this.axios.get('FabckInquire').then(res => {
        this.tableData = res.data.result
      })
    },
    //  移除
    deleteRow (id) {
      this.axios.post('del', { id: id }).then(res => {
        if (res.status === 200) {
          if (res.data.status == true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.reload()
          } else {
            this.$message.error('删除失败')
          }
        }
      })
    },
    //  查看
    handleClick (row) {
      this.box_input = true
      this.formInline = row
    },
    //  date
    data (val) {
      var data = new Date(val)
      var y = data.getFullYear()
      var m = data.getMonth() + 1
      var d = data.getDate()
      return y + '-' + m + '-' + d
    }
  },
  created () {
    this.quire()
  }
}
</script>

<style scoped>
  /deep/.el-table__body .cell{white-space: nowrap;}
  /deep/.text {font-size: 14px;}
  /deep/.item {margin-bottom: 18px;}
  /deep/.clearfix:before, .clearfix:after {display: table;content: "";}
  /deep/.clearfix:after {clear: both}
  .box-card {width: 480px;}
  .posav{position: absolute;left: 0;top: 0;width: 100%;background-color: rgba(89, 89, 89, 0.6);z-index: 99999;height: 100%;}
  /deep/.box-input{position: absolute;top: 17%;left: 35%;}
</style>

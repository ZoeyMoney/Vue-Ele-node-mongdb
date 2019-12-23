<template>
    <div class="UserName">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column label="手机号" width="180">
            <div slot-scope="scope" v-if="scope.row.phone !=null ">
              <template>{{ scope.row.phone}}</template>
            </div>
            <div  slot-scope="scope" v-else="scope.row.phone == null">
              <template>无</template>
            </div>
          </el-table-column>
          <el-table-column prop="Email" label="邮箱" width="200">
            <div slot-scope="scope" v-if="scope.row.Email !=null ">
              <template>{{ scope.row.Email}}</template>
            </div>
            <div  slot-scope="scope" v-else="scope.row.Email == null">
              <template>无</template>
            </div>
          </el-table-column>
          <el-table-column prop="age" label="年龄" width="100">
            <div slot-scope="scope" v-if="scope.row.age !=null ">
              <template>{{ scope.row.age}}</template>
            </div>
            <div  slot-scope="scope" v-else="scope.row.age == null">
              <template>无</template>
            </div>
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="100">
            <div slot-scope="scope" v-if="scope.row.gender !=null ">
              <template>{{ scope.row.gender}}</template>
            </div>
            <div  slot-scope="scope" v-else="scope.row.age == null">
              <template>无</template>
            </div>
          </el-table-column>
          <el-table-column label="职业" width="380">
            <div slot-scope="scope" v-if="scope.row.zhiye !=null">
              <template>{{ scope.row.zhiye}}</template>
            </div>
            <div slot-scope="scope" v-else-if="scope.row.zhiye ==null">
              <template>无</template>
            </div>
          </el-table-column>
          <el-table-column prop="Date" label="日期" width="100">
            <template slot-scope="scope">{{ data(scope.row.data) }}</template>
          </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row.user_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage1"
        :page-sizes="[8]"
        :page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <div class="posav" v-show="box_input">
        <el-card class="box-card box-input">
          <div slot="header" class="clearfix">
            <span style="font-size: 15px;font-weight: 600">个人详情</span>
            <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="box_input=false"></i></el-button>
          </div>
          <div class="text item">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-input v-model="formInline.name" placeholder="名字" :disabled="true"></el-input>
              <el-input v-model="formInline.phone" placeholder="电话" :disabled="true"></el-input>
              <el-input v-model="formInline.Email" placeholder="邮箱" :disabled="true"></el-input>
              <el-input v-model="formInline.age" placeholder="年龄" :disabled="true"></el-input>
              <el-input v-model="formInline.gender" placeholder="性别" :disabled="true"></el-input>
              <el-input v-model="formInline.ZhiYe" placeholder="职业" :disabled="true"></el-input>
              <el-input v-model="formInline.Date" placeholder="日期" :disabled="true"></el-input>
            </el-form>
            <div class="btn">
              <el-button type="info" @click="add(formInline._id)">保存</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'UserName',
  data () {
    return {
      tableData: [],
      box_input: false,
      formInline: {
        name: '',
        phone: '',
        Email: '',
        age: '',
        gender: '',
        zhiye: '',
        Date: ''
      },
      currentPage1: 1,
      total: 0
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      var pages = { page: val, pageSize: 8 }
      this.axios.post('UserNameSearch', pages).then(res => {
        this.tableData = res.data.search
      })
    },
    handleClick (row) {
      this.box_input = true
      this.formInline = row
    },
    //  查询个人信息
    UserNameSearch () {
      this.axios.post('UserNameSearch').then(res => {
        this.tableData = res.data.search
        this.total = res.data.total
      })
    },
    //  删除
    del (id) {
      this.axios.post(`delteUser/${id}`).then(res => {
        if (res.status === 200) {
          if (res.data.status == true) {
            this.$message({ message: '删除成功', type: 'success' })
            this.reload()
          } else {
            this.$message.error('删除失败')
          }
        }
      })
    },
    //  修改
    add (id) {
      var _true = true
      if (this.formInline.name == '') {
        this.$message.error({ message: '用户不能为空' })
        _true = false
        return false
      }
      this.axios.post(`UserNameUpdate/${id}`, this.formInline).then(res => {
        if (res.status === 200) {
          if (res.data.status == true) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.box_input = false
          } else {
            this.$message.error('修改失败')
          }
        }
      })
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
    this.UserNameSearch()
  }
}
</script>

<style scoped>
  .posav{position: absolute;left: 0;top: 0;width: 100%;background-color: rgba(89, 89, 89, 0.6);z-index: 99999;height: 100%;}
  /deep/.box-input{position: absolute;top: 17%;left: 35%;}
  .btn{text-align: center;}
  /deep/.el-table .cell{white-space: nowrap}
  /*分页*/
  /deep/.el-pagination{text-align: right;padding-right: 33px;padding-top: 20px}
</style>

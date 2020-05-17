<template>
    <div class="tables">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="日期">
          <el-date-picker v-model="formInline.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="金钱">
          <el-input v-model="formInline.money" placeholder="金钱" @blur="ifCode"></el-input>
        </el-form-item>
        <el-form-item label="花费情况">
          <el-input v-model="formInline.text" placeholder="花费情况"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.code" placeholder="评分状态">
            <el-option v-for="(item,i) in listCode" :label="item.label" :value="item.label" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">插入</el-button>
        </el-form-item>
      </el-form>
      <div class="titles">
        <div>
          <p class="ti">友情提示：如果日期不填将默认提交时的时间。 <span style="padding-left: 30px">列表显示颜色：1.<b>优</b>。2.<b>良好</b>。3.<b>差</b>。4.<b>过高</b>。</span></p>
        </div>
        <div>
          <p class="ti">
            <el-select v-model="value" clearable placeholder="日期选择" style="width: 110px;height: 40px;padding-right: 20px" size="mini" @change="option(value)">
              <el-option v-for="(item,i) in options" :key="i" :label="item" :value="item"></el-option>
            </el-select>
            总额：{{moneyAll}}
          </p>
        </div>
      </div>
        <el-table :data="tableData.filter(name=>!value || name.DateY.toLowerCase().includes(value.toLowerCase()))" border style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column fixed label="日期" width="200">
            <template slot-scope="scope">{{ scope.row.DateY }}</template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="money" label="金钱" width="120"></el-table-column>
          <el-table-column prop="text" label="理由" width="300"></el-table-column>
          <el-table-column prop="code" label="状态" width="120"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        :total="pageTotal">
      </el-pagination>
    </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'tables',
  data () {
    return {
      tableData: [],
      formInline: {
        name: '',
        text: '',
        date: '',
        code: '',
        money: '',
        DateY: ''
      },
      listCode: [
        { label: '差' },
        { label: '良好' },
        { label: '优' },
        { label: '过高' }
      ],
      options: '',
      value: '',
      moneyAll: 0,
      backup: 0,
      //  分页
      currentPage1: 1,
      pageTotal: 0
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      var pages = { page: val, pageSize: 8 }
      this.axios.post('MoneySearch', pages).then(res => {
        this.tableData = res.data.search
      })
    },
    // 删除
    handleDelete (index, row) {
      this.axios.post('deleteMoney', row).then(res => {
        if (res.status == 200) {
          if (res.data.status == true) {
            this.$message({ message: '删除成功', type: 'success' })
            this.reload()
          } else {
            this.$message.error('名字不能为空')
          }
        }
      })
    },
    // 保存
    onSubmit () {
      var _true = true
      var nameReg = /^[\u4E00-\u9FA5]{2,10}$/ // 验证人的名字
      var nuber = /^\d+(\.\d+)?$/ // 验证数字
      // 提交时如果时间为空则默认提交时的时间
      if (this.formInline.date == '') {
        this.formInline.Date = new Date()
      }
      // 名字
      if (this.formInline.name == '') {
        this.$message.error('名字不能为空')
        _true = false
        return false
      }
      if (!nameReg.test(this.formInline.name)) {
        this.$message.error('名字格式错误')
        _true = false
        return false
      }
      // 金钱
      if (this.formInline.money == '') {
        this.$message.error('金钱不能为空')
        _true = false
        return false
      }
      if (!nuber.test(this.formInline.money)) {
        this.$message.error('金钱格式错误')
        _true = false
        return false
      }
      // 花费情况
      if (this.formInline.text.length <= 4) {
        this.$message.error('花费情况最低5个字')
        _true = false
        return false
      }
      // 状态
      if (this.formInline.code == '') {
        this.$message.error('状态不能为空')
        _true = false
        return false
      }
      this.axios.post('money', this.formInline).then(res => {
        if (res.status === 200) {
          if (res.data.code == 200) {
            this.$message({ message: res.data.msg, type: 'success' })
            this.reload()
          } else if (res.data.code == 201) {
            this.$message.error(res.data.msg)
          }
        }
      })
    },
    // 金额查询
    SearchInput () {
      var money_all = 0
      this.axios.post('MoneySearch').then(res => {
        this.tableData = res.data.search
        this.pageTotal = res.data.total
        var tableData = []// 时间
        var Data
        for (var index in this.tableData) {
          money_all += this.tableData[index].money
          tableData.push(this.tableData[index].DateY)
        }
        Data = tableData.filter(function (item, index, self) {
          return self.indexOf(item) == index
        })
        if (tableData != '') {
          this.options = Data
        }
        this.moneyAll = money_all
        this.backup = money_all
      })
    },
    //  判断状态
    ifCode () {
      var all = ''
      if (this.formInline.money <= 5 && this.formInline.money != '') {
        all += '优'
      } else if (this.formInline.money <= 9 && this.formInline.money != '') {
        all += '良好'
      } else if (this.formInline.money <= 15 && this.formInline.money != '') {
        all += '差'
      } else if (this.formInline.money >= 20 && this.formInline.money != '') {
        all += '过高'
      }
      this.formInline.code = all
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.money <= 5) {
        return 'success-row'
      } else if (row.money <= 9) {
        return 'liangOk'
      } else if (row.money <= 15) {
        return 'nored'
      } else if (row.money >= 20) {
        return 'redmoney'
      }
      return ''
    },
    option (id) {
      var arr = []
      var number = 0
      // 搜索内容
      for (var i in this.tableData) {
        if (id == this.tableData[i].DateY) {
          arr.push(this.tableData[i])
        }
      }
      // 搜索出来的内容循环金额相加
      for (var i in arr) {
        number += arr[i].money
      }
      if (id != '') {
        this.moneyAll = number
      } else {
        this.moneyAll = this.backup
      }
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
    this.SearchInput()
  }
}
</script>

<style scoped>
/deep/.el-form-item{margin-bottom: 0}
/deep/.el-form{margin-top: 19px;padding-left: 10px}
  /deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{margin-bottom: 0}
  /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner{width: 188px}
/deep/.el-table .warning-row {background: oldlace;}
/deep/.el-table .success-row {background: #f0f9eb;}
  /deep/.el-table .redmoney{background: #f6dadd}
  /deep/.el-table .nored{background: #fff6f9}
  /deep/.el-table .liangOk{background: #ebf8f2}
  .titles{display: flex;}
  .titles div:nth-child(1){flex: 1}
  .titles div:nth-child(2){flex: 1;text-align: right;padding-right: 35px}
.ti{padding-left: 13px;font-size: 11px;color: gray;}
  .ti span b:nth-child(1){color: #d8ffc3}
  .ti span b:nth-child(2){color: #f6dadd}
  .ti span b:nth-child(3){color: #fff6f9}
  .ti span b:nth-child(4){color: #ebf8f2}
  /*分页*/
  /deep/.el-pagination{text-align: right;padding-right: 33px;padding-top: 20px}
</style>

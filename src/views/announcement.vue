<template>
    <div class="announcement">
      <template>
        <el-table :data="tableData" style="width: 100%" height="600" @selection-change="handle">
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column prop="name" label="昵称" width="70"></el-table-column>
          <el-table-column label="信息" width="950">
            <template slot-scope="scope">
              <el-badge :is-dot="scope.row.status === 0" class="items">{{scope.row.text}}</el-badge>
            </template>
          </el-table-column>
          <el-table-column prop="Data" label="日期" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-button type="danger" size="medium" @click="delete_data">删除</el-button>
    </div>
</template>

<script>
  export default {
    inject:['reload'],
    name: 'announcement',
    data(){
      return {
        tableData: [],
        checked: false,
        multipleSelection: []
      }
    },
    methods:{
      GetSql(){
        this.axios.get('GetAnnouncement').then(res=>{
          if (res.status === 200){
            if (res.data.code ===200){
              this.tableData = res.data.data;
            }else{
              this.$message.error(res.data.msg);
            }
          }else{
            this.$message.error('数据异常');
          }
        });
      },
      handleClick(id){
        this.axios.post('Updataannouncement',id);
        this.$router.push(`/viewAnnouncement/${JSON.stringify(id)}`);
      },
      //删除
      delete_data(){
        let data = this.multipleSelection;
        this.axios.post('delete_announcement',data).then(res=>{
          if (res.status === 200){
            if (res.data.code === 200){
              this.$message({message:res.data.msg,type:'success'});
              this.reload();
            }else{
              this.$message.error(res.data.msg);
            }
          }
        })
      },
      //选中
      handle(val){
        this.multipleSelection = val;
      },
    },
    created(){
      this.GetSql();
    },
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  /deep/.el-table .cell{white-space: nowrap}
  /deep/.el-badge__content.is-fixed{top: 2px!important;}
</style>

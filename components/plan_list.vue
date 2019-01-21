<template>
    <div class="table">
    <el-table :data="tableData" style="width: 100%" ref="multipleTable">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="title" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center">
      </el-table-column>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center">
      </el-table-column>
       <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text">
        <span @click="delRow(scope)">删除</span>
        </el-button>
      </template>
    </el-table-column>
    </el-table>  
    <div style="margin-top: 20px">
        <router-link to="/homepage/plan">
        <span class="add"><i class="fa fa-plus" aria-hidden="true"></i> 添加</span>
        </router-link>
    </div>
    </div>
</template>

<script>
export default {
  name: 'today_list',
  data(){
     return {
         tableData: [{
            title: "",
            type: '',
            create_time: ''
          }],
     }
  },
  created(){
      let that = this
      this.$axios.request({
          url:"http://127.0.0.1:8000/api/v1/backup/?token=" + this.$Cookies.get("token"), 
          methods:"GET",
      }).then(function(ret){
          that.tableData = ret.data
      }).catch(function(ret){
          console.log("获取数据失败")
      })
  },
  methods:{
      delRow(scope){
          let that = this
          this.$confirm('此操作将永久删除该事件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(function(){
                that.$axios.request({
                url:"http://127.0.0.1:8000/api/v1/backup/?token=" + that.$Cookies.get("token"),
                method:"DELETE",
                data:{id:scope.row.id},
                headers:{"content-type":"application/json"}
            }).then(function(ret){
                if(ret.data.code == 1000){
                    that.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    let index = scope.$index
                    that.tableData.splice(index,1)

                }else{
                    that.$message({
                        type: 'warning',
                        message: '删除失败!'
                    })
                }          
            }).catch(function(ret){
                console.log(ret)
            })
            }).catch(function(){
                that.$message({
                type: 'info',
                message: '取消删除!'
            });
            })
      }
  }
  
  } 
</script>


<style scoped>
.add{
  color:#409eff;
  font-size:14px;
  cursor:pointer
}
.add:hover{
  color:green;
}
</style>

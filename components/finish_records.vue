<template>
    <div class="table">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="event_name" label="名称" align="center">
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center">
            </el-table-column>
            </el-table-column>
            <el-table-column prop="completed_time" label="完成时间" align="center">
            </el-table-column> 
            <el-table-column label="完成总结" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="text">
                <span @click="view(scope)">查看</span>
                </el-button>
            </template>
            </el-table-column>
        </el-table>  
    </div>
</template>

<script>
export default {
  name: 'today_list',
  data(){
     return {
         tableData: [{
            event_name: "",
            type: '',
            completed_time: '',
            summary:"",
          }],
      }
  },
  created(){
      let that = this
      this.$axios.request({
          url:"http://127.0.0.1:8000/api/v1/history/?token=" + this.$Cookies.get("token"),
          method:"GET",
          params:{"is_completed":0}
      }).then(function(ret){
          that.tableData = ret.data
      }).catch(function(ret){
          alert("获取失败")
      })
  },
  methods:{
    view(scope){
        this.$alert(scope.row.summary, '总结', {
        confirmButtonText: '确定',
        }).then(function(){

        })
    }
  }
}
</script>

<style>

</style>

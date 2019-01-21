<template>
    <div class="table">
    <el-table :data="tableData" style="width: 100%" ref="multipleTable"  @selection-change="batch">
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
        <router-link :to="{name:'today',params:{id:scope.row.id}}">查看</router-link></el-button>
      </template>
    </el-table-column>
    </el-table>  
    <div style="margin-top: 20px">
        <el-button v-if="batchopt" @click="delRow">{{batchMsg}}</el-button>
    </div>
    </div>
</template>

<script>
export default {
  name: 'today_list',
  data(){
     return {
         tableData: [{
            id:"\d+",
            title: "",
            type: '',
            create_time: ''
          }],
          batchopt:false,
          batchMsg:"删除",
          selectRow:""
     }
  },
  created(){
      let that = this
      this.$axios.request({
          url:"http://127.0.0.1:8000/api/v1/completion/?token=" + this.$Cookies.get("token"), 
          methods:"GET",
      }).then(function(ret){
          that.tableData = ret.data
      }).catch(function(ret){
          console.log("获取数据失败")
      })
  },
  methods:{
      delRow(){
        let that = this
        let index_list = []
        this.$confirm('此操作将永久删除该事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(function(){
            $.each(that.selectRow,function(i,item){
                that.tableData.splice(that.tableData.indexOf(item),1)
                index_list.push(item.id)
            })
            that.$axios.request({
                url:"http://127.0.0.1:8000/api/v1/completion/?token=" + that.$Cookies.get("token"),
                method:"DELETE",
                data:{index_list:index_list},
                headers:{"content-type":"application/json"}
            }).then(function(ret){
                if(ret.data.code == 1000){
                    that.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
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
          
      },
      batch(val,row){
          if(val.length == 0){
              this.batchopt = false
          }else if(val.length == 1){
              this.batchopt = true
          }else{
              this.batchopt = true
              this.batchMsg = "批量删除"
          }
          this.selectRow = val
      }
  }
  
  } 
</script>


<style scoped>
</style>

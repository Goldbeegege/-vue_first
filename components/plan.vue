<template>
  
  <el-form ref="Form" :model="form" label-width="100px">
  <el-form-item label="事件名称" :required="true">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  
  <el-form-item label="大致内容" :required="true">
    <el-input type="textarea" v-model="form.detail"></el-input>
  </el-form-item>
  <el-form-item label="事件类型" style="display:inline-block" :required="true">
    <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in form.type_list" :key="item.id" :label="item.title" :value="item.id">
      </el-option>
    </el-select>
    <span class="add" @click="addType">
      <i class="fa fa-plus" aria-hidden="true"></i>
    </span>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitData">确定</el-button>
  </el-form-item>  
</el-form>
<!--右侧工具栏-->
</el-row>

    
</div>
</template>

<script>
export default {
  name: 'today',
  data(){
     return {
         form: {
          title: '',
          detail: '',
          type_list:[{"id":"1","title":"工作"}],
        },
        value: '',
        is_pop:true
     }
  },
  created(){
    let that = this
    this.$axios.request({
      url:"http://127.0.0.1:8000/api/v1/type_list/?token=" + this.$Cookies.get("token"),
      method:"GET", 
    }).then(function(ret){
      that.form.type_list = ret.data
    }).catch(function(ret){
      console.log(ret)
    })
  },
  
  methods:{
    submitData(){
      let data = {  title:this.form.title,
                    detail:this.form.detail,
                    type_id:this.value
                  }
      let that = this
      if(this.checkInput(data)){
        this.$confirm('数据提交后今日将无法修改,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'}).then(function(){
            that.createData()
          }).catch(function(){
              that.$message({
                type:"info",
                message:"取消提交"
              })
          })
      }      
    },

    createData(){
      let that = this
      that.$axios.request({
        url:"http://127.0.0.1:8000/api/v1/backup/?token=" + that.$Cookies.get("token"),
        method:"POST",
        data:{
          title:that.form.title,
          detail:that.form.detail,
          type_id:that.value
        }
      }).then(function(ret){
          if(ret.data.code == 1000){
            that.$message({
              type:"success",
              message:"创建成功"
            })
            that.$router.push({"name":"planList"})
          }else{
            that.$message({
              type:"error",
              message:"创建失败"
            })
          }
      }).catch(function(ret){
          console.log(ret)
      })
    },

    addType(){
      let that = this
      this.$prompt('请添加一个类型吧！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        }).then(function(){
          let input = $(".el-input__inner").eq("-1").val()
          that.$axios.request({
            url:"http://127.0.0.1:8000/api/v1/type_list/?token=" + that.$Cookies.get("token"),
            method:"POST",
            data:{title:input},
            headers:{"content-type":"application/json"}
          }).then(function(ret){
            if(ret.data.code == 1000){
              that.form.type_list.push(ret.data.new_type)
              that.value = ret.data.new_type.id
            }else{
              console.log(ret)
            }
          })          
        }).catch(
          function(ret){
          console.log(ret)
        })

    },

    checkInput(data){
      let that = this
      let count = 0
      $.each(data,function(key,value){
        let val = $.trim(value)        
        if(val.length == 0){
          that.$alert('红色标记的输入框中请勿输入空白符', '错误提示', {
          confirmButtonText: '确定',})
          count ++
          return
        }
      })
      if(count == 0){
        return true
      }else{
        return false
      }
      
    }
  }
} 
</script>

<style scoped>
.add{
  color:#409eff;
  font-size:1.5em;
  cursor:pointer;
  float:right;
  margin-left:10px;
}
.add:hover{
  color:green;
}
</style>

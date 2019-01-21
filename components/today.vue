<template>
  
  <el-form ref="form" :model="form" label-width="100px">
  <el-form-item label="事件名称">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  <el-form-item label="大致内容">
    <el-input type="textarea" v-model="form.detail"></el-input>
  </el-form-item>
  <el-form-item label="事件类型">
      <el-input v-model="form.type"></el-input>
  </el-form-item>
  <el-form-item>
    <el-switch  v-model="form.is_done" inactive-text="未完成" active-text="完成" inactive-color="#ff4949" active-color="#13ce66">
    </el-switch>      
  </el-form-item> 
  <el-form-item label="总结一下吧" v-if="form.is_completed">
      <el-input type="textarea" v-model="form.summary"></el-input>
  </el-form-item>
  <el-form-item label="未完成原因" v-else="form.is_done">
    <el-input type="textarea" v-model="form.reason"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submit_today">确定</el-button>
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
          id:"",
          title: '',
          detail: '',
          type:"",
          is_completed:false,
          reason:"",
          summary: '',
        },
        is_pop:true
     }
  },
  created(){
      let view_id = this.$route.params.id
      let that = this
      this.$axios.request({
          url:"http://127.0.0.1:8000/api/v1/completion/" + view_id + "/?token=" + this.$Cookies.get("token"), 
          methods:"GET",
      }).then(function(ret){
          that.form = ret.data
      }).catch(function(ret){
          console.log("获取数据失败")
      })
  },
  methods:{
    submit_today(){
      let that = this
      if(!this.form.is_done){
        if(this.is_pop){
            this.$alert(this.form.title + '还没有完成哦！', '没完成提醒', {
            confirmButtonText: '确定',
            callback:this.cancel_alert})
            return
          }
      }
      this.$confirm('数据提交后将无法修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
            that.submit_data()
        }).catch(function(){
          that.$message({
            type: 'info',
            message: '已取消提交'
          });     
        })
    },

    submit_data(){
      let that = this
      this.$axios.request({
        url:"http://127.0.0.1:8000/api/v1/completion/?token=" + this.$Cookies.get("token"),
        method:"POST",
        data:JSON.stringify(this.form),
        // headers:{"content-type":"application/json"}
      }).then(function(ret){
        console.log(ret)
        if(ret.data.code == 1000){
          that.$router.push({path:"/homepage"})
        }else{
          that.$alert(ret.data.msg, ret.data.error, {
          confirmButtonText: '确定',})
        }
      }).catch(function(ret){
        console.log(ret)
      })
    },
  
    cancel_alert(){
      this.is_pop = false
    }
  }
} 
</script>

<style scoped>
</style>

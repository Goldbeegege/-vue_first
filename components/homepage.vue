<template>
    <div class="home_content"> 
        <!--左侧导航栏-->
    <el-row>   
        <el-col :span="4">
            <ul class="left-bar">
                <li>
                    <i class="el-icon-warning el-icon"></i>
                    <span slot="title">今日待做</span>
                </li>
                <li>
                    <i class="el-icon-edit-outline el-icon"></i>
                    <span slot="title">明日计划</span>
                </li>
                <li>
                    <i class="el-icon-document el-icon"></i>
                    <span slot="title">历史记录</span>
                </li>
            </ul>
        
    </el-col>
  
  <!--中间内容-->
  <el-col :xs="16" :md={span:12,offset:2} style="margin-top:20px;">
  <el-form ref="form" :model="form" label-width="100px">
  <el-form-item label="事件名称">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  <el-form-item label="大致内容">
    <el-input type="textarea" v-model="form.detail"></el-input>
  </el-form-item>
  <el-form-item label="事件类型">
      <el-select  v-model="form.region" placeholder="事件类型">
        <el-option v-for="item in form.type" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
        </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-switch  v-model="form.is_done" inactive-text="未完成" active-text="完成" inactive-color="#ff4949" active-color="#13ce66">
    </el-switch>      
  </el-form-item> 
  <el-form-item label="总结一下吧" v-if="form.is_done">
      <el-input type="textarea" v-model="form.summary"></el-input>
  </el-form-item>
  <el-form-item label="未完成原因" v-else="form.is_done">
    <el-input type="textarea" v-model="form.uncompletd_reason"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary">确定</el-button>
  </el-form-item>
  
</el-form>
</el-col>
<!--右侧工具栏-->
</el-row>

    
</div>
</template>

<script>
export default {
  name: 'homepage',
  data(){
     return {
         form: {
          title: '',
          detail: '',
          type: [{value:"hello",label:"world"}],
          is_done:false,
          uncompletd_reason:"",
          summary: '',
           region:""
        }
     }
  },
  created(){
      this.$axios.request({
          url:"http://127.0.0.1:8000/api/v1/backup/?token=" + this.$Cookies.get("token"), 
          methods:"GET",
      }).then(function(ret){
          console.log(ret)
      }).catch(function(ret){
          console.log("获取数据失败")
      })
  }
} 
</script>

<style scoped>


ul {
    padding:0;
    list-style: none;
    border-right: 1px solid #eee;
}
.left-bar li{
    padding:0;
    font-size:0.85em;
    height:55px;
    line-height:55px;
    text-align: center;
    cursor:pointer;
}
.left-bar li:hover{
    background-color: #bbe2fa;
}
.el-icon{
    font-size: 16px;
    margin-right:5px;
    line-height: 55px;
    color:#393b3d;
}

@media(max-width:480px){ 
    .left-bar li{
        height:40px;
        line-height:40px;
    }
    .left-bar li span, .left-bar li i,form label{ font-size:0.5em; };
    
}

@media(max-width:768px){ 
    form label{font-size:0.5em;}
    .left-bar .el-icon{display:none};
    
}
.home_content{
  width:96%;
  margin:10px auto;
};

</style>

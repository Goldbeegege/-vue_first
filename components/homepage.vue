<template>
    <div class="home_content"> 
        <!--左侧导航栏-->
        <el-row>   
            <el-col :span="4">
                <ul class="left-bar">
                    <li>
                        <i class="el-icon-warning el-icon"></i>
                        <span slot="title">
                            <router-link to="/homepage/">今日待做</router-link>
                        </span>
                    </li>
                    <li>
                        <i class="el-icon-edit-outline el-icon"></i>
                        <span slot="title"><router-link to="/homepage/plan_list">明日计划</router-link></span>
                    </li>
                    <li>
                        <i class="el-icon-document el-icon"></i>
                        <span slot="title" @click="showHistory">历史记录</span>
                        <el-collapse  v-if="isShow">
                            <ul>
                                <li><router-link to="/homepage/history/finish">完成记录</router-link></li>
                                <li><router-link to="/homepage/history/unfinish">未完成记录</router-link></li>
                            </ul>
                        </el-collapse>
                    </li>
                    
                </ul>        
            </el-col>
            <!--中间内容-->
            <el-col :xs="16" :md={span:14,offset:2} style="margin-top:20px;">
                <router-view/>
            </el-col>
        </el-row>    
        
    </div>
</template>

<script>
import todayList from "./today_list"
export default {
  name: 'homepage',
  data(){
     return {
         isShow:false
     }
  },
  components:{
      todayList
  },
  created(){
      if(this.$route.name == "finish" || this.$route.name == "unfinish"){
          this.isShow = true
      }
  },
  methods:{
      showHistory(){
          this.isShow = !this.isShow
      }
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

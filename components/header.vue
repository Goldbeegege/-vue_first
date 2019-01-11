<template>
    <div class="container">    
        <el-menu class="el-menu-demo" mode="horizontal" :default-active="active">
        <el-menu-item index="1">
            <router-link to="/">首页</router-link>            
        </el-menu-item>
        <el-menu-item style="float:right" index="2" v-if="this.$Cookies.get('is_login')">
            <router-link to="/homepage">{{this.$Cookies.get("username")}}</router-link>
        </el-menu-item>
        <el-menu-item style="float:right" index="2" v-else>
            <router-link to="/login">登录</router-link>
        </el-menu-item>
        <el-menu-item style="float:right" index="3" v-if="this.$Cookies.get('is_login')">
            <span style="course:pointer;" @click="logout">注销</span>
        </el-menu-item>
        <el-menu-item style="float:right" index="3" v-else>
            <router-link to="/register">注册</router-link>
        </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
  name: 'vheader',
  data(){
      return {
            activeIndex:"1",
            index_list:[
                {path:"/",index:"1"},
                {path:"/login",index:"2"},
                {path:"/register",index:"3"},
            ]
      }
  },
  computed:{
      active(){
          return this.initIndex()
          
      }
  },
  created(){
      this.initIndex()
  },
  methods:{
      initIndex(){
          let that = this
          $.each(this.index_list,function(i,item){
              if(item["path"] == that.$route.path){
                that.activeIndex = item["index"]                
              }
          })
          return this.activeIndex
      },
      logout(){
          let that = this
          this.$axios.request({
              url:"http://127.0.0.1:8000/logout/",
              method:"GET"
          }).then(function(ret){
              if(ret.data.code == 3000){
                  that.$Cookies.remove("sessionid")
                  that.$Cookies.remove("username")
                  that.$Cookies.remove("is_login")
                  that.$Cookies.remove("token")
                  if(that.$route.meta.requireAuth){
                      that.$router.push({name:"login"})
                  }else{
                      window.location.reload()
                  }
              }else{
                  that.$alert(ret.data.msg,ret.data.error,{
                      confirmButtonText: '确定'
                  })
              }
          }).catch(function(ret){
              console.log(ret)
          })
        
      }
  }
}
</script>

<style>
.container{
  width:96%;
  margin:0 auto;
};
a{
  text-decoration: none;  
}
</style>

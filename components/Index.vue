<template>
<div class="wrapper">
  <div class="container">    
      <form class="form-signin" autocomplete="off">
        <h2 class="form-signin-heading">Please sign in</h2>
        <label for="username" class="sr-only">Email address</label>
        <input id="username" class="form-control" placeholder="请输入用户名" @blur="lookupUser" v-model="value_dict.username" @focus="clearError(error.username)">
        <div class="error_msg"><span v-if="error.username.error">{{error.username.msg}}</span></div>
        <label for="password" class="sr-only">Password</label>
        <input type="password" id="Password" class="form-control" placeholder="请输入密码" @focus="clearError(error.password)" @blur="emptyValue(error,'password')" v-model="value_dict.password">
        <div class="error_msg"><span v-if="error.password.error">{{error.password.msg}}</span></div>
        <label for="re_password" class="sr-only">re_password</label>
        <input type="password" id="re_password" class="form-control" placeholder="请确认密码" @focus="clearError(error.re_password)" @blur="emptyValue(error,'re_password')" v-model="value_dict.re_password">
        <div class="error_msg"><span v-if="error.re_password.error">{{error.re_password.msg}}</span></div>
        <label for="email" class="sr-only">Password</label>
        <input id="email" class="form-control" placeholder="请输入邮箱" @focus="clearError(error.email)" @blur="emptyValue(error,'email')" v-model="value_dict.email">
        <div class="error_msg"><span v-if="error.email.error">{{error.email.msg}}</span></div>
        <div class="btn btn-lg btn-primary btn-block" @click="sub">Sign in</div>
      </form>
    </div>
    </div>
</template>
  
<script>
$(function(){
})
export default {
  name: 'Index',
  data () {
    return {
      value_dict:{
        username:"",
        password:"",
        re_password:"",
        email:""
      },
      error:{
        username:{error:false,msg:"",alert:"请输入用户名"},
        password:{error:false,msg:"",alert:"请输入密码"},
        re_password:{error:false,msg:"",alert:"请确认密码"},
        email:{error:false,msg:"",alert:"请输入邮箱"},
      }
    }
  },
  methods:{
    emptyValue(error,label){
      if(!this.value_dict[label]){
        error[label].error = true
        error[label].msg = error[label].alert
      }
    },

    clearError(value){
      value.error = false
      value.msg = ""
    },
    lookupUser(){
      if (!this.value_dict.username){
        this.error.username.error = true
        this.error.username.msg = this.error.username.alert
      }else{
        let that = this
        let username = this.value_dict.username;
        this.$axios.request({
          url:"http://127.0.0.1:8000/api/v1/lookupUser/?username=" + username,
          method:"GET"
        }).then(function(ret){
          if (ret.data.code == 1001){
            that.error.username.error = true
            that.error.username.msg = ret.data.msg
          }
        }).catch(function(ret){
          console.log(ret)
        })
      }
    },
    sub(){
      let that = this
      let count = 0
      //提交前检查所有的input是否都已经填写，当count=0时表示所有的输入框全部填写
      $.each(this.value_dict,function(key,value){
        if(!value){
          that.error[key].error = true
          that.error[key].msg = that.error[key].alert
          count ++
        }
      })
      if(count==0){
        //当输入框全部输入数值时，逐个校验所输入的是否符合规范
        //1:校验用户名是否符合规范
        that.validation_username("username")
        
      }else{
        return
      }
    },

    //校验用户名
    validation_username(label){
      let username = this.value_dict[label]
      let reg = /^\w{3,16}$/
      let ret = reg.test(username)
      if(!ret){
        if (username.length < 3){
          this.error.username.error = true
          this.error.username.msg = "用户名长度小于3个字符"
        }else if(username.length > 16){
          this.error.username.error = true
          this.error.username.msg = "用户名长度大于16个字符"
        }else{
          this.error.username.error = true
          this.error.username.msg = "用户名中只能包含数字字母或下划线"
        }
        return false
      }else{
        return true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.error_msg{
  height:25px;
  color:red;
}
.wrapper{
  height:100%;
  width:100%;
  background:url("../assets/img/backgrounds/1.jpg");
  background-size:cover;
   background-attachment: fixed;
}

.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}

</style>

<template>
<div class="wrapper">
  <div class="container">    
      <form class="form-signin" autocomplete="off">
        <div>
        <span><strong>现在登录!</strong></span>
        <span style="float:right">还没账号？<router-link to="/register">注册一个!</router-link></span>
        </div>
        <label for="username" class="sr-only">username</label>
        <input id="username" class="form-control" placeholder="请输入用户名" @blur="emptyValue(error,'username')" v-model="value_dict.username" @focus="clearError(error.username)">
        <div class="error_msg"><span v-if="error.username.error">{{error.username.msg}}</span></div>
        <label for="password" class="sr-only">Password</label>
        <input type="password" id="Password" class="form-control" placeholder="请输入密码" @focus="clearError(error.password)" @blur="emptyValue(error,'password')" v-model="value_dict.password">
        <div class="error_msg"><span v-if="error.password.error">{{error.password.msg}}</span></div>
        <div class="btn btn-lg btn-primary btn-block" @click="sub">登 录</div>
      </form>
    </div>
    </div>
</template>
  
<script>
$(function(){
})
export default {
  name: 'Login',
  data () {
    return {
      value_dict:{
        username:"",
        password:"",
      },
      error:{
        username:{error:false,msg:"",alert:"请输入用户名",ch_name:"用户名"},
        password:{error:false,msg:"",alert:"请输入密码",ch_name:"密码"},
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
        let user_res = that.validation_username("username")
        let password_res = that.validation_password("password")
        if(user_res && password_res){
          this.$axios.request({
            url:"http://127.0.0.1:8000/login/",
            method:"POST",
            data:that.value_dict,
            headers:{"content-type":"application/json"}
          }).then(function(ret){
            if(ret.data.code == 1000){
              console.log("ok")
              console.log(that.Cookies.get("token"))
            }
          }).catch(function(ret){
            console.log(ret)
          })
        }else{
          return
        }
        
      }else{
        return
      }
    },

    //校验用户名
    validation_username(label){      
      let username = this.value_dict[label]
      let reg = /^\w{3,16}$/
      let ret = reg.test(username)
      let res = this.validation_rule(ret,"username",3,16)
      return res
    },

  //校验密码
  validation_password(label){
      let password = this.value_dict[label]
      let reg = /^\w{8,16}$/
      let ret = reg.test(password)
      let res = this.validation_rule(ret,"password",8,16)
      return res
    },

    //将共同的验证规则写在一起
    validation_rule(ret,field,min_length,max_length){
      if(!ret){
        if (this.value_dict[field].length < min_length){
          this.error[field]["error"] = true
          this.error[field].msg = this.error[field]["ch_name"] + "长度小于"+min_length+"个字符"
        }else if(field.length > max_length){
          this.error[field].error = true
          this.error[field].msg = this.error[field]["ch_name"]+"长度大于" +max_length+"个字符"
        }else{
          this.error[field].error = true
          this.error[field].msg = this.error[field]["ch_name"]+"中只能包含数字、字母或下划线"
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
/* .wrapper{
  height:100%;
  width:100%;
  background:url("../assets/img/backgrounds/1.jpg");
  background-size:cover;
   background-attachment: fixed;
} */

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

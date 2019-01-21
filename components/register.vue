<template>
<el-container>
    <el-main>
        <el-row>
          <el-col :xs={span:10,offset:7} :sm={span:8,offset:8} :md={span:8,offset:8} :lg={span:6,offset:9} :xl={span:2,offset:11}>
            <el-input type="text" autocomplete="off" placeholder="请输入用户名" @blur="lookupUser" v-model="value_dict.username" @focus="clearError(error.username)"></el-input>
            <div class="error_msg"><span v-if="error.username.error">{{error.username.msg}}</span></div>
          </el-col>      
        </el-row>
        <el-row>
          <el-col :xs={span:10,offset:7} :sm={span:8,offset:8} :md={span:8,offset:8} :lg={span:6,offset:9} :xl={span:2,offset:11}>
            <el-input  type="password" autocomplete="off" placeholder="请输入密码" @focus="clearError(error.password)" @blur="emptyValue(error,'password')" v-model="value_dict.password"></el-input>
            <div class="error_msg"><span v-if="error.password.error">{{error.password.msg}}</span></div>
          </el-col>              
        </el-row> 
        <el-row>
          <el-col :xs={span:10,offset:7} :sm={span:8,offset:8} :md={span:8,offset:8} :lg={span:6,offset:9} :xl={span:2,offset:11}>
            <el-input  type="password" autocomplete="off" placeholder="请确认密码" @focus="clearError(error.re_password)" @blur="emptyValue(error,'re_password')" v-model="value_dict.re_password"></el-input>
            <div class="error_msg"><span v-if="error.re_password.error">{{error.re_password.msg}}</span></div>
          </el-col>              
        </el-row>
        <el-row>
          <el-col :xs={span:10,offset:7} :sm={span:8,offset:8} :md={span:8,offset:8} :lg={span:6,offset:9} :xl={span:2,offset:11}>
            <el-input  type="email" autocomplete="off" placeholder="请输入邮箱" @focus="clearError(error.email)" @blur="emptyValue(error,'email')" v-model="value_dict.email"></el-input>
            <div class="error_msg"><span v-if="error.email.error">{{error.email.msg}}</span></div>
          </el-col>              
        </el-row>    
        <el-row>
          <el-col :xs={span:10,offset:7} :sm={span:8,offset:8} :md={span:8,offset:8} :lg={span:6,offset:9} :xl={span:2,offset:11}>
            <el-button style="float:right" type="success" plain @click="sub">注册</el-button>
          </el-col>          
        </el-row>         
    </el-main>
  </el-container>
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
        re_password:"",
        email:""
      },
      error:{
        username:{error:false,msg:"",alert:"请输入用户名",ch_name:"用户名"},
        password:{error:false,msg:"",alert:"请输入密码",ch_name:"密码"},
        re_password:{error:false,msg:"",alert:"请确认密码",ch_name:"确认密码"},
        email:{error:false,msg:"",alert:"请输入邮箱",ch_name:"邮箱"},
      }
    }
  },
  created(){
    if(this.$Cookies.get("is_login")){
        this.$router.push({path:"/"})
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
        let user_res = that.validation_username("username")
        let password_res = that.validation_password("password")
        let re_password_res = that.validation_repassword("re_password")
        let eamil_res = that.validation_email("email")
        if(user_res && password_res && re_password_res && eamil_res){
          this.$axios.request({
            url:"http://127.0.0.1:8000/register/",
            method:"POST",
            data:JSON.stringify(that.value_dict),
            // headers:{"content-type":"text/plain"}
          }).then(function(ret){
            if(ret.data.code == 1000){
              that.$Cookies.set("token",ret.data.token)
              that.$Cookies.set("username",ret.data.username)
              that.$Cookies.set("is_login",true)
              that.$router.push({path:"/"})
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

    //校验两次密码输入是否一致
    validation_repassword(label){
      let re_password = this.value_dict[label]
      let password = this.value_dict["password"]
      if(re_password == password){
        return true
      }else{
        this.error.re_password.error = true
        this.error.re_password.msg = "两次密码输入不一致"
        return false
      }
    },
    //校验邮箱地址是否合法
    validation_email(label){
      let email = this.value_dict[label]
      let reg = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z]+(\.[0-9a-zA-Z_.-])*\.[0-9a-zA-Z]{2,6}/
      let ret = reg.test(email)
      if(!ret){
        this.error.email.error = true
        this.error.email.msg = "邮箱地址不正确"
        return false
      }else{
        return true
      }
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

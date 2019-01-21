<template>
  <el-container>
    <el-main>
        <el-row>
          <el-col :xs={span:10,offset:7} :sm={span:8,offset:8} :md={span:8,offset:8} :lg={span:6,offset:9} :xl={span:2,offset:11}>
            <el-input type="text" autocomplete="off" placeholder="请输入用户名" @blur="emptyValue(error,'username')" v-model="value_dict.username" @focus="clearError(error.username)"></el-input>
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
            <el-button id="popup-submit" style="float:right" type="success" plain>登录</el-button>
          </el-col>          
        </el-row>         
    <div id="popup-captcha"></div>
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
      },
      error:{
        username:{error:false,msg:"",alert:"请输入用户名",ch_name:"用户名"},
        password:{error:false,msg:"",alert:"请输入密码",ch_name:"密码"},
      },
    }
  },
  created(){
    if(this.$Cookies.get("is_login")){
      this.$router.push({path:"/"})
    }else{
      $.ajax({
        url: "http://127.0.0.1:8000/login/?t=" + (new Date()).getTime(), // 加随机数防止缓存
        type: "get",
        dataType: "json",
        success: function (data) {
          that.$Cookies.set("user_id",data.user_id)
          that.$Cookies.set("status",data.status)
            // 使用initGeetest接口
            // 参数1：配置参数
            // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
            }, that.handlerPopup);
        }
    });
    }
    let that = this
    
  },
  methods:{
    emptyValue(error,label){
      if(!this.value_dict[label]){
        error[label].error = true
        error[label].msg = error[label].alert
      }
    },
    handlerPopup(captchaObj) {
        // 成功的回调
        let that = this
        captchaObj.onSuccess(function () {
            var validate = captchaObj.getValidate();
            that.sub(validate)
        });
        $("#popup-submit").click(function () {
            captchaObj.show();
        });
        captchaObj.appendTo("#popup-captcha");
      
    },

    clearError(value){
      value.error = false
      value.msg = ""
    },
    sub(validate){
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
          this.value_dict["geetest_challenge"] = validate["geetest_challenge"]
          this.value_dict["geetest_validate"] = validate["geetest_validate"]
          this.value_dict["geetest_seccode"] = validate["geetest_seccode"]
          this.value_dict["status"] = this.$Cookies.get("status")
          this.value_dict["user_id"] = this.$Cookies.get("user_id")
          this.$axios.request({
            url:"http://127.0.0.1:8000/login/",
            method:"POST",
            data:JSON.stringify(this.value_dict),
            // headers:{"content-type":"text/plain"}
          }).then(function(ret){
            if(ret.data.code == 1000){
              console.log(ret.data)              
              that.$Cookies.set("token",ret.data.token)
              that.$Cookies.set("is_login",true)
              that.$Cookies.set("username",ret.data.username)         
              if(that.$route.query["backName"]){   
                that.$router.push({name:that.$route.query["backName"]})
              }else{
                that.$router.push({name:"index"})
              }
            }else{
              console.log(ret.data)
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
.el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
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
/* 以下遮罩层为demo.用户可自行设计实现 */
#mask {
    display: none;
    position: fixed;
    text-align: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: auto;
}

/* 可自行设计实现captcha的位置大小 */
.popup-mobile {
    position: relative;
}

#popup-captcha-mobile {
    position: fixed;
    display: none;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    z-index: 9999;
}
</style>

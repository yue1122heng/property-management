<template>
  <div class="login">
    <img src="../../assets/logo.jpg" alt="">
    <div class="container">
      <div class="source">
        <el-tabs v-model="activeName">
            <el-tab-pane label="账号登录" name="login-account">
                <login-account></login-account>
            </el-tab-pane>
            <el-tab-pane label="手机登录" name="login-phone">
                <login-phone></login-phone>
            </el-tab-pane>
            <el-tab-pane label="邮箱登录" name="login-email">
                <login-email></login-email>
            </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import LoginAccount from "../../components/LoginAccount.vue";
import LoginEmail from "../../components/LoginEmail.vue";
import LoginPhone from "../../components/LoginPhone.vue";

export default {
  name: "Login",
  data() {
    return {
      activeName: "login-account"
    };
  },
  components: {
    LoginAccount,
    LoginEmail,
    LoginPhone
  }
};
</script>

<style scoped>
.login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
img{
  display: block;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.container {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  background: #f9f9f9;
}
.source {
  padding: 24px;
}
</style>



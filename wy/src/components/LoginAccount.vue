<template>
    <div class="login-account">
        <el-form :model="accForm" :rules="accRules" ref="accForm" label-width="60px">
            <el-form-item label="账号" prop="loginName">
                <el-input v-model="accForm.loginName" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="accForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" @click.prevent="submit('accForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "LoginAccount",
  data() {
    return {
      accForm: {
        loginFlag: 0,
        loginName: "",
        password: ""
      },
      accRules: {
        loginName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      isLogin: "isLogin"
    })
  },
  methods: {
    ...mapMutations(["login"]),
    submit(formName) {
      var vm = this;
      vm.$refs[formName].validate(valid => {
        if (valid) {
          vm.axios
            .post("/api/users/login", vm.accForm)
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.login(response.data.user);
              vm.$router.push({ name: "home" });
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.login-account {
  width: 350px;
}
</style>



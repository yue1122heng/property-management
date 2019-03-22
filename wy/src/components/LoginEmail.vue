<template>
    <div class="login-email">
        <el-form :model="emailForm" :rules="emailRules" ref="emailForm" label-width="60px">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="emailForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="emailForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" @click.prevent="submit('emailForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "LoginEmail",
  data() {
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入邮箱"));
      }
      var regular = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regular.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      } else {
        return callback();
      }
    };
    return {
      emailForm: {
        loginFlag: 1,
        email: "",
        password: ""
      },
      emailRules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
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
            .post("/api/users/login", vm.emailForm)
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
.login-email {
  width: 350px;
}
</style>



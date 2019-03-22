<template>
    <div class="login-phone">
        <el-form :model="phoneForm" :rules="phoneRules" ref="phoneForm" label-width="60px">
            <el-form-item label="手机" prop="phone">
                <el-input v-model="phoneForm.phone" placeholder="请输入手机"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="phoneForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" @click.prevent="submit('phoneForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "LoginPhone",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机"));
      }
      var regular = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
      if (!regular.test(value)) {
        return callback(new Error("手机格式不正确"));
      } else {
        return callback();
      }
    };
    return {
      phoneForm: {
        loginFlag: 2,
        phone: "",
        password: ""
      },
      phoneRules: {
        phone: [{ validator: checkPhone, trigger: "blur" }],
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
            .post("/api/users/login", vm.phoneForm)
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
.login-phone {
  width: 350px;
}
</style>



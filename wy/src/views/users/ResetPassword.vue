<template>
    <div class="reset-password">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'user' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'resetPassword' }">重置密码</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="resetPasswordForm" :rules="rules" ref="resetPasswordForm" label-width="100px" class="resetPasswordForm">
            <el-form-item label="用户名" prop="loginName">
                <el-input v-model="resetPasswordForm.loginName" placeholder="请输入用户名" size="small" style="width:300px" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="userName">
                <el-input v-model="resetPasswordForm.userName" placeholder="请输入姓名" size="small" style="width:300px" disabled></el-input>
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" v-model="resetPasswordForm.oldPassword" placeholder="请输入密码" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="resetPasswordForm.newPassword" placeholder="请输入密码" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="resetPasswordForm.confirmPassword" placeholder="请输入密码" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('resetPasswordForm')" size="small" icon="el-icon-check">保存</el-button>
                <el-button type="info" @click="resetForm('resetPasswordForm')" size="small" icon="el-icon-close">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: "ResetPassword",
  data() {
    var checkNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else {
        if (this.resetPasswordForm.confirmPassword) {
          this.$refs.resetPasswordForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    var checkConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.resetPasswordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      resetPasswordForm: {
        loginName: "",
        userName: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        newPassword: [
          { validator: checkNewPassword, trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { validator: checkConfirmPassword, trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    userId() {
      return this.$route.query.userId;
    }
  },
  created() {
    this.getUser(this.userId);
  },
  methods: {
    getUser(userId) {
      var vm = this;
      this.axios
        .get("/api/users/get", { params: { userId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          var user = data.users[0];
          vm.resetPasswordForm.loginName = user.loginName;
          vm.resetPasswordForm.userName = user.userName;
        });
    },
    submitForm(formName) {
      var vm = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          vm.resetPasswordForm.userId = vm.userId;
          vm
            .axios({
              method: "PUT",
              url: "/api/users/resetPassword",
              data: vm.resetPasswordForm
            })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.$router.push({ name: "user" });
            });
        }
      });
    },
    resetForm(formName) {
      this.resetPasswordForm.oldPassword = "";
      this.resetPasswordForm.newPassword = "";
      this.resetPasswordForm.confirmPassword = "";
    }
  }
};
</script>

<style scoped>
.reset-password {
  background-color: #fff;
}
.resetPasswordForm {
  padding: 25px !important;
}
</style>


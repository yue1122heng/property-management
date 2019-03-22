<template>
    <div class="user-save">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'user' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户{{msg}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="userForm">
            <el-form-item label="用户名" prop="loginName">
                <el-input v-model="userForm.loginName" placeholder="请输入用户名" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email" placeholder="请输入邮箱" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="userForm.phone" placeholder="请输入手机" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-if="!edit">
                <el-input type="password" v-model="userForm.password" placeholder="请输入密码" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="userName">
                <el-input v-model="userForm.userName" placeholder="请输入姓名" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="所属公司" prop="companyId">
                <el-select v-model="userForm.companyId" placeholder="请选择" size="small" style="width:300px">
                  <el-option v-for="(com,index) in userForm.companies" :key="index" :label="com.companyName" :value="com.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')" size="small" icon="el-icon-check">{{msg}}</el-button>
                <el-button type="info" @click="resetForm('userForm')" size="small" icon="el-icon-close">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: "UserSave",
  computed: {
    edit() {
      return this.$route.query.edit;
    },
    userId() {
      return this.$route.query.userId;
    },
    msg() {
      return this.edit ? "编辑" : "添加";
    }
  },
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
      userForm: {
        loginName: "",
        email: "",
        phone: "",
        password: "",
        userName: "",
        companyId: null,
        companies: []
      },
      rules: {
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        companyId: [{ required: true, message: "请选择公司", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCompanies();
    if (this.edit && this.userId) {
      this.getUser(this.userId);
    }
  },
  methods: {
    submitForm(formName) {
      var vm = this;

      this.$refs[formName].validate(valid => {
        if (valid) {
          vm.userForm.userId = vm.userId;
          vm
            .axios({
              method: vm.edit ? "PUT" : "POST",
              url: vm.edit ? "/api/users/put" : "/api/users/post",
              data: vm.userForm
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
      this.$refs[formName].resetFields();
    },
    getCompanies() {
      var vm = this;
      this.axios.get("/api/companies/get").then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.userForm.companies = data.companies;
        }
      });
    },
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
          vm.userForm.loginName = user.loginName;
          vm.userForm.email = user.email;
          vm.userForm.phone = user.phone;
          vm.userForm.userName = user.userName;
          vm.userForm.companyId = user.companyId;
        });
    }
  }
};
</script>

<style scoped>
.user-save {
  background-color: #fff;
  padding-top: 10px;
}
.userForm {
  padding: 25px !important;
}
</style>



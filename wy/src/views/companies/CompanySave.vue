<template>
    <div class="company-save">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'company' }">公司管理</el-breadcrumb-item>
            <el-breadcrumb-item>公司{{msg}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="companyForm" :rules="rules" ref="companyForm" label-width="100px" class="companyForm">
            <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="companyForm.companyName" placeholder="请输入公司名称" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="companyForm.contact" placeholder="请输入联系方式" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="address">
                <el-input v-model="companyForm.address" placeholder="请输入公司地址" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱" prop="email">
                <el-input v-model="companyForm.email" placeholder="请输入公司邮箱" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="公司法人" prop="legalPerson">
                <el-input v-model="companyForm.legalPerson" placeholder="请输入公司法人" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="principal">
                <el-input v-model="companyForm.principal" placeholder="请输入负责人" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('companyForm')" size="small" icon="el-icon-check">{{msg}}</el-button>
                <el-button type="info" @click="resetForm('companyForm')" size="small" icon="el-icon-close">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: "CompanySave",
  computed: {
    edit() {
      return this.$route.query.edit;
    },
    companyId() {
      return this.$route.query.companyId;
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
    return {
      companyForm: {
        companyName: "",
        contact: "",
        address: "",
        email: "",
        legalPerson: "",
        principal: ""
      },
      rules: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入公司地址", trigger: "blur" }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        legalPerson: [
          { required: true, message: "请输入公司法人", trigger: "blur" }
        ],
        principal: [{ required: true, message: "请输入负责人", trigger: "blur" }]
      }
    };
  },
  created() {
    if (this.edit && this.companyId) {
      this.getCompany(this.companyId);
    }
  },
  methods: {
    submitForm(formName) {
      var vm = this;

      this.$refs[formName].validate(valid => {
        if (valid) {
          vm.companyForm.companyId = vm.companyId;
          vm
            .axios({
              method: vm.edit ? "PUT" : "POST",
              url: vm.edit ? "/api/companies/put" : "/api/companies/post",
              data: vm.companyForm
            })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.$router.push({ name: "company" });
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCompany(companyId) {
      var vm = this;
      this.axios
        .get("/api/companies/get", { params: { companyId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          var company = data.companies[0];
          vm.companyForm.companyName = company.companyName;
          vm.companyForm.contact = company.contact;
          vm.companyForm.address = company.address;
          vm.companyForm.email = company.email;
          vm.companyForm.legalPerson = company.legalPerson;
          vm.companyForm.principal = company.principal;
        });
    }
  }
};
</script>

<style scoped>
.company-save {
  background-color: #fff;
  padding-top: 10px;
}
.companyForm {
  padding: 25px !important;
}
</style>



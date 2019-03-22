<template>
  <div class="company">
    <el-row class="bg-white">
      <el-col :span="24">
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              &nbsp;&nbsp;<el-button type="primary" size="small" icon="el-icon-plus" 
              @click="$router.push({ name: 'companySave', query: { edit: false } })">添加</el-button>
            </template>
            <el-form ref="form" :model="form" label-width="80px" :inline="true" class="form">
              <el-form-item label="公司名称">
                <el-input v-model="form.companyName" size="small"></el-input>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input v-model="form.contact" size="small"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="form.address" size="small"></el-input>
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="form.email" size="small"></el-input>
              </el-form-item>
              <el-form-item label="公司法人">
                <el-input v-model="form.legalPerson" size="small"></el-input>
              </el-form-item>
              <el-form-item label="负责人">
                <el-input v-model="form.principal" size="small"></el-input>
              </el-form-item>
              <el-form-item label="创建人">
                <el-select v-model="form.createUser" placeholder="请选择" size="small">
                  <el-option v-for="(user,index) in form.users" :key="index" :label="user.userName" :value="user.userId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="form.status" size="small">
                  <el-option label="全部" :value="-1"></el-option>
                  <el-option label="正常" :value="0"></el-option>
                  <el-option label="禁用" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-col :span="12">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="form.createTimeStart" size="small"></el-date-picker>
                </el-col>
                <el-col :span="12">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="form.createTimeEnd" size="small"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-search" @click="getCompanies()">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-table
      :data="companies"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        fixed
        prop="companyName"
        label="公司名称" width="180">
      </el-table-column>
      <el-table-column
        fixed
        prop="contact"
        label="联系方式" width="110">
      </el-table-column>
      <el-table-column
        prop="address"
        label="公司地址" width="250">
      </el-table-column>
      <el-table-column
        prop="email"
        label="公司邮箱" width="150">>
      </el-table-column>
      <el-table-column
        prop="legalPerson"
        label="公司法人" width="80">
      </el-table-column>
      <el-table-column
        prop="principal"
        label="负责人" width="80">
      </el-table-column>
      <el-table-column
      prop="status"
      label="状态"
      width="70">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status == 0 ? 'primary' : 'danger'"
          disable-transitions>{{scope.row.status==0 ? '正常': '禁用'}}
        </el-tag>
      </template>
    </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间" :formatter="formatterTime" width="180">
      </el-table-column>
      <el-table-column
        prop="createUserName"
        label="创建人" width="90">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="编辑时间" :formatter="formatterTime" width="180">
      </el-table-column>
      <el-table-column
        prop="updateUserName"
        label="编辑人员" width="90">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit"
          @click="$router.push({ name: 'companySave', query: { edit: true, companyId: scope.row.companyId } })" circle title="编辑"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteOne(scope.row.companyId)" circle title="删除"></el-button>
          <el-button :type="scope.row.status==0?'info':'success'" size="small" icon="el-icon-edit-outline" @click="setStatus(scope.row.companyId, scope.row.status==0?1:0)" circle :title="scope.row.status==0?'禁用':'启用'"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="bg-white">
      <el-col :span="24">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
      
    </el-row>
    <el-row class="bg-white">
      <el-col :span="24">
        &nbsp;&nbsp;<el-button type="danger" size="small" icon="el-icon-delete" @click="deleteMore()">批量删除</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Company",
  data() {
    return {
      companies: [],
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        companyName: "",
        contact: "",
        address: "",
        email: "",
        legalPerson: "",
        principal: "",
        status: -1,
        createTimeStart: null,
        createTimeEnd: null,
        createUser: null,
        updateTimeStart: null,
        updateTimeEnd: null,
        updateUser: null,
        users: []
      },
      companyIds: []
    };
  },
  created() {
    this.getCompanies();
    this.getAllUsers();
  },
  methods: {
    getCompanies() {
      var params = {
        companyName: this.form.companyName,
        contact: this.form.contact,
        address: this.form.address,
        email: this.form.email,
        legalPerson: this.form.legalPerson,
        principal: this.form.principal,
        status: this.form.status,

        createTimeStart: this.form.createTimeStart,
        createTimeEnd: this.form.createTimeEnd,
        createUser: this.form.createUser,
        updateTimeStart: this.form.updateTimeStart,
        updateTimeEnd: this.form.updateTimeEnd,
        updateUser: this.form.updateUser,

        page: this.page,
        pageSize: this.pageSize
      };

      var vm = this;
      this.axios.get("/api/companies/get", { params }).then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.total = data.total;
          vm.companies = data.companies;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCompanies();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getCompanies();
    },
    getAllUsers() {
      var vm = this;
      this.axios.get("/api/users/getAll").then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.form.users = data.users;
        }
      });
    },
    formatterTime(row, column) {
      if (row[column.property]) {
        return this.moment(row[column.property]).format("YYYY-MM-DD H:mm:ss");
      }
      return row[column.property];
    },
    add() {
      this.$router.push({ name: "companySave", query: { edit: false } });
    },
    deleteOne(companyId) {
      var vm = this;
      vm.axios
        .delete("/api/companies/delete", { data: { companyIds: companyId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getCompanies();
          vm.$message({
            type: "success",
            message: "删除成功!"
          });
        });
    },
    handleSelectionChange(val) {
      this.companyIds = val.map(v => v.companyId);
    },
    deleteMore() {
      var len = this.companyIds.length;
      if (len == 0) {
        this.$alert("请选择要删除的数据！", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      var companyIds = this.companyIds.join(",");
      companyIds = companyIds.substring(0, companyIds.length);

      var vm = this;
      this.$confirm(`确认要删除您选中的${len}条数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          vm.axios
            .delete("/api/companies/delete", { data: { companyIds } })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.getCompanies();
              vm.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    setStatus(companyId, status) {
      var vm = this;
      vm.axios
        .put("/api/companies/setStatus", { companyId, status })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getCompanies();
          vm.$message({
            type: "success",
            message: `${status == 0 ? "启用" : "禁用"}成功！`
          });
        });
    }
  }
};
</script>

<style scoped>
.el-table th div {
  text-align: center !important;
}
.form {
  padding-top: 20px;
}
.el-collapse-item__content {
  padding-bottom: 0 !important;
}
.el-select{
  width: 200px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 200px;
}
</style>


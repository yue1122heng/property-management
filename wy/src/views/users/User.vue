<template>
  <div class="user">
    <el-row class="bg-white">
      <el-col :span="24">
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              &nbsp;&nbsp;<el-button type="primary" size="small" icon="el-icon-plus" 
              @click="$router.push({ name: 'userSave', query: { edit: false } })">添加</el-button>
            </template>
            <el-form ref="form" :model="form" label-width="80px" :inline="true" class="form">
              <el-form-item label="用户名">
                <el-input v-model="form.loginName" size="small"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="form.userName" size="small"></el-input>
              </el-form-item>
              <el-form-item label="手机">
                <el-input v-model="form.phone" size="small"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form.email" size="small"></el-input>
              </el-form-item>
              <el-form-item label="所属公司">
                <el-select v-model="form.companyId" placeholder="请选择" size="small">
                  <el-option v-for="(com,index) in form.companies" :key="index" :label="com.companyName" :value="com.companyId"></el-option>
                </el-select>
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
                <el-button type="primary" size="small" icon="el-icon-search" @click="getUsers()">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-table
      :data="users"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        fixed
        prop="loginName"
        label="用户名" width="90">
      </el-table-column>
      <el-table-column
        fixed
        prop="userName"
        label="姓名" width="90">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机" width="120">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱" width="150">>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="所属公司" width="200">
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
        label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit"
          @click="$router.push({ name: 'userSave', query: { edit: true, userId: scope.row.userId } })" circle title="编辑"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteOne(scope.row.userId)" circle title="删除"></el-button>
          <el-button :type="scope.row.status==0?'info':'success'" size="small" icon="el-icon-edit-outline" @click="setStatus(scope.row.userId, scope.row.status==0?1:0)" circle :title="scope.row.status==0?'禁用':'启用'"></el-button>
          <el-button type="primary" size="small" icon="el-icon-view" circle title="重置密码" 
          @click="$router.push({ name: 'resetPassword', query: { userId: scope.row.userId } })"></el-button>
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
  name: "User",
  data() {
    return {
      users: [],
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        loginName: "",
        userName: "",
        phone: "",
        email: "",
        companyId: null,
        companies: [],
        status: -1,
        createTimeStart: null,
        createTimeEnd: null,
        createUser: null,
        updateTimeStart: null,
        updateTimeEnd: null,
        updateUser: null,
        users: []
      },
      userIds: []
    };
  },
  created() {
    this.getUsers();
    this.getCompanies();
    this.getAllUsers();
  },
  methods: {
    getUsers() {
      var params = {
        loginName: this.form.loginName,
        emai: this.form.email,
        phone: this.form.phone,
        userName: this.form.userName,
        companyId: this.form.companyId,
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
      this.axios.get("/api/users/get", { params }).then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.total = data.total;
          vm.users = data.users;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    getCompanies() {
      var vm = this;
      this.axios.get("/api/companies/get").then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.form.companies = data.companies;
        }
      });
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
      this.$router.push({ name: "userSave", query: { edit: false } });
    },
    deleteOne(userId) {
      var vm = this;
      vm.axios
        .delete("/api/users/delete", { data: { userIds: userId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getUsers();
          vm.$message({
            type: "success",
            message: "删除成功!"
          });
        });
    },
    handleSelectionChange(val) {
      this.userIds = val.map(v => v.userId);
    },
    deleteMore() {
      var len = this.userIds.length;
      if (len == 0) {
        this.$alert("请选择要删除的数据！", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      var userIds = this.userIds.join(",");
      userIds = userIds.substring(0, userIds.length);

      var vm = this;
      this.$confirm(`确认要删除您选中的${len}条数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          vm.axios
            .delete("/api/users/delete", { data: { userIds } })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.getUsers();
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
    setStatus(userId, status) {
      var vm = this;
      vm.axios
        .put("/api/users/setStatus", { userId, status })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getUsers();
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


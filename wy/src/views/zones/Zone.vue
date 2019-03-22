<template>
  <div class="zone">
    <el-row class="bg-white">
      <el-col :span="24">
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              &nbsp;&nbsp;<el-button type="primary" size="small" icon="el-icon-plus" 
              @click="$router.push({ name: 'zoneSave', query: { edit: false } })">添加</el-button>
            </template>
            <el-form ref="form" :model="form" label-width="100px" :inline="true" class="form">
              <el-form-item label="小区名称">
                <el-input v-model="form.zoneName" size="small" width="80"></el-input>
              </el-form-item>
              <el-form-item label="所属公司">
                <el-select v-model="form.companyId" placeholder="请选择" size="small" width="80">
                  <el-option v-for="(com,index) in form.companies" :key="index" :label="com.companyName" :value="com.companyId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="小区负责人">
                <el-input v-model="form.principal" size="small"></el-input>
              </el-form-item>
              <el-form-item label="负责人电话">
                <el-input v-model="form.contact" size="small"></el-input>
              </el-form-item>
              <el-form-item label="小区位置">
                <el-input v-model="form.address" size="small"></el-input>
              </el-form-item>
              <el-form-item label="小区占地面积">
                <el-input v-model="form.area" size="small"></el-input>
              </el-form-item>
              <el-form-item label="建筑面积">
                <el-input v-model="form.areaStructure" size="small"></el-input>
              </el-form-item>
              <el-form-item label="道路面积">
                <el-input v-model="form.areaRoad" size="small"></el-input>
              </el-form-item>
              <el-form-item label="高层楼宇数量">
                <el-input v-model="form.houseCount" size="small"></el-input>
              </el-form-item>
              <el-form-item label="多层楼宇数量">
                <el-input v-model="form.houseCount2" size="small"></el-input>
              </el-form-item>
              <el-form-item label="车位数量">
                <el-input v-model="form.carCount" size="small"></el-input>
              </el-form-item>
              <el-form-item label="车库面积">
                <el-input v-model="form.areaCar" size="small"></el-input>
              </el-form-item>
              <el-form-item label="公共场所面积">
                <el-input v-model="form.areaPublic" size="small"></el-input>
              </el-form-item>
              <el-form-item label="绿化面积">
                <el-input v-model="form.areaGreen" size="small"></el-input>
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
              <el-form-item label="建成时间">
                <el-col :span="12">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="form.buildTimeStart" size="small"></el-date-picker>
                </el-col>
                <el-col :span="12">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="form.buildTimeEnd" size="small"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-search" @click="getZones()">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-table
      :data="zones"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        fixed
        prop="zoneName"
        label="小区名称" width="150">
      </el-table-column>
      <el-table-column
        fixed
        prop="principal"
        label="小区负责人" width="100">
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="公司名称" width="180">
      </el-table-column>
      <el-table-column
        prop="contact"
        label="负责人电话" width="130">
      </el-table-column>
      <el-table-column
        prop="address"
        label="小区位置" width="250">>
      </el-table-column>
      <el-table-column
        prop="buildTime"
        label="建成时间" :formatter="formatterTime" width="180">
      </el-table-column>
      <el-table-column
        prop="area"
        label="占地面积" width="80">
      </el-table-column>
      <el-table-column
        prop="areaStructure"
        label="建筑面积" width="80">
      </el-table-column>
      <el-table-column
        prop="areaRoad"
        label="道路面积" width="80">
      </el-table-column>
      <el-table-column
        prop="houseCount"
        label="高层楼宇数量" width="120">
      </el-table-column>
      <el-table-column
        prop="houseCount2"
        label="多层楼宇数量" width="120">
      </el-table-column>
      <el-table-column
        prop="carCount"
        label="车位数量" width="80">
      </el-table-column>
      <el-table-column
        prop="areaCar"
        label="车库面积" width="80">
      </el-table-column>
      <el-table-column
        prop="areaPublic"
        label="公共场所面积" width="120">
      </el-table-column>
      <el-table-column
        prop="areaGreen"
        label="绿化面积" width="80">
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
          @click="$router.push({ name: 'zoneSave', query: { edit: true, zoneId: scope.row.zoneId } })" circle title="编辑"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteOne(scope.row.zoneId)" circle title="删除"></el-button>
          <el-button :type="scope.row.status==0?'info':'success'" size="small" icon="el-icon-edit-outline" @click="setStatus(scope.row.zoneId, scope.row.status==0?1:0)" circle :title="scope.row.status==0?'禁用':'启用'"></el-button>
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
  name: "Zone",
  data() {
    return {
      zones: [],
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        zoneName: "",
        companyId: null,
        principal: "",
        contact: "",
        address: "",
        buildTimeStart: null,
        buildTimeEnd: null,
        area: "",
        areaStructure: "",
        areaRoad: "",
        houseCount: "",
        houseCount2: "",
        carCount: "",
        areaCar: "",
        areaPublic: "",
        areaGreen: "",
        status: -1,
        createTimeStart: null,
        createTimeEnd: null,
        createUser: null,
        updateTimeStart: null,
        updateTimeEnd: null,
        updateUser: null,
        users: [],
        companies: [],
      },
      zoneIds: []
    };
  },
  created() {
    this.getCompanies();
    this.getZones();
    this.getAllUsers();
  },
  methods: {
    getCompanies() {
      var vm = this;
      this.axios.get("/api/companies/get").then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.form.companies = data.companies;
        }
      });
    },
    getZones() {
      var params = {
        zoneName: this.form.zoneName,
        companyId: this.form.companyId,
        principal: this.form.principal,
        contact: this.form.contact,
        address: this.form.address,
        buildTimeStart: this.form.buildTimeStart,
        buildTimeEnd: this.form.buildTimeEnd,
        area: this.form.area,
        areaStructure: this.form.areaStructure,
        areaRoad: this.form.areaRoad,
        houseCount: this.form.houseCount,
        houseCount2: this.form.houseCount2,
        carCount: this.form.carCount,
        areaCar: this.form.areaCar,
        areaPublic: this.form.areaPublic,
        areaGreen: this.form.areaGreen,
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
      this.axios.get("/api/zones/get", { params }).then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.total = data.total;
          vm.zones = data.zones;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getZones();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getZones();
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
      this.$router.push({ name: "zoneSave", query: { edit: false } });
    },
    deleteOne(zoneId) {
      var vm = this;
      vm.axios
        .delete("/api/zones/delete", { data: { zoneIds: zoneId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getZones();
          vm.$message({
            type: "success",
            message: "删除成功!"
          });
        });
    },
    handleSelectionChange(val) {
      this.zoneIds = val.map(v => v.zoneId);
    },
    deleteMore() {
      var len = this.zoneIds.length;
      if (len == 0) {
        this.$alert("请选择要删除的数据！", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      var zoneIds = this.zoneIds.join(",");
      zoneIds = zoneIds.substring(0, zoneIds.length);

      var vm = this;
      this.$confirm(`确认要删除您选中的${len}条数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          vm.axios
            .delete("/api/zones/delete", { data: { zoneIds } })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.getZones();
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
    setStatus(zoneId, status) {
      var vm = this;
      vm.axios
        .put("/api/zones/setStatus", { zoneId, status })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getZones();
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


<template>
  <div class="building">
    <el-row class="bg-white">
      <el-col :span="24">
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              &nbsp;&nbsp;<el-button type="primary" size="small" icon="el-icon-plus" 
              @click="$router.push({ name: 'buildingSave', query: { edit: false } })">添加</el-button>
            </template>
            <el-form ref="form" :model="form" label-width="80px" :inline="true" class="form">
              <el-form-item label="楼宇名称">
                <el-input v-model="form.buildingName" size="small"></el-input>
              </el-form-item>
              <el-form-item label="所属小区">
                <el-select v-model="form.zoneId" placeholder="请选择" size="small">
                  <el-option v-for="(z,index) in form.zones" :key="index" :label="z.zoneName" :value="z.zoneId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="层数">
                <el-input v-model="form.layerCount" size="small"></el-input>
              </el-form-item>
              <el-form-item label="高度">
                <el-input v-model="form.height" size="small"></el-input>
              </el-form-item>
              <el-form-item label="建筑面积">
                <el-input v-model="form.area" size="small"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="form.type" size="small">
                  <el-option label="全部" :value="'全部'"></el-option>
                  <el-option label="高层" :value="'高层'"></el-option>
                  <el-option label="多层" :value="'多层'"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="朝向">
                <el-select v-model="form.direction" size="small">
                  <el-option label="全部" :value="'全部'"></el-option>
                  <el-option label="坐北朝南" :value="'坐北朝南'"></el-option>
                  <el-option label="坐西朝东" :value="'坐西朝东'"></el-option>
                  <el-option label="坐南朝北" :value="'坐南朝北'"></el-option>
                  <el-option label="坐东朝西" :value="'坐东朝西'"></el-option>
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
              <el-form-item label="建成日期">
                <el-col :span="12">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="form.buildTimeStart" size="small"></el-date-picker>
                </el-col>
                <el-col :span="12">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="form.buildTimeEnd" size="small"></el-date-picker>
                </el-col>
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
                <el-button type="primary" size="small" icon="el-icon-search" @click="getBuildings()">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-table
      :data="buildings"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        fixed
        prop="buildingName"
        label="公司名称" width="180">
      </el-table-column>
      <el-table-column
        prop="zoneName"
        label="所属小区" width="110">
      </el-table-column>
      <el-table-column
        prop="layerCount"
        label="层数" width="250">
      </el-table-column>
      <el-table-column
        prop="height"
        label="高度" width="150">>
      </el-table-column>
      <el-table-column
        prop="area"
        label="建筑面积" width="80">
      </el-table-column>
      <el-table-column
        prop="buildTime"
        label="建成日期" :formatter="formatterTime" width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型" width="80">
      </el-table-column>
      <el-table-column
        prop="direction"
        label="朝向" width="80">
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
          @click="$router.push({ name: 'buildingSave', query: { edit: true, buildingId: scope.row.buildingId } })" circle title="编辑"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteOne(scope.row.buildingId)" circle title="删除"></el-button>
          <el-button :type="scope.row.status==0?'info':'success'" size="small" icon="el-icon-edit-outline" @click="setStatus(scope.row.buildingId, scope.row.status==0?1:0)" circle :title="scope.row.status==0?'禁用':'启用'"></el-button>
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
  name: "Building",
  data() {
    return {
      buildings: [],
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        buildingName: "",
        zoneId: "",
        zones: [],
        layerCount: "",
        height: "",
        area: "",
        buildTimeStart: null,
        buildTimeEnd: null,
        type: "全部",
        direction: "全部",
        status: -1,
        createTimeStart: null,
        createTimeEnd: null,
        createUser: null,
        updateTimeStart: null,
        updateTimeEnd: null,
        updateUser: null,
        users: []
      },
      buildingIds: []
    };
  },
  created() {
    this.getAllUsers();
    this.getZones();
    this.getBuildings();
  },
  methods: {
    getBuildings() {
      var params = {
        buildingName: this.form.buildingName,
        zoneId: this.form.zoneId,
        layerCount: this.form.layerCount,
        height: this.form.height,
        area: this.form.area,
        buildTimeStart: this.form.buildTimeStart,
        buildTimeEnd: this.form.buildTimeEnd,
        type: this.form.type,
        direction: this.form.direction,
        
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
      this.axios.get("/api/buildings/get", { params }).then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.total = data.total;
          vm.buildings = data.buildings;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getBuildings();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getBuildings();
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
      this.$router.push({ name: "buildingSave", query: { edit: false } });
    },
    deleteOne(buildingId) {
      var vm = this;
      vm.axios
        .delete("/api/buildings/delete", { data: { buildingIds: buildingId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getBuildings();
          vm.$message({
            type: "success",
            message: "删除成功!"
          });
        });
    },
    handleSelectionChange(val) {
      this.buildingIds = val.map(v => v.buildingId);
    },
    deleteMore() {
      var len = this.buildingIds.length;
      if (len == 0) {
        this.$alert("请选择要删除的数据！", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      var buildingIds = this.buildingIds.join(",");
      buildingIds = buildingIds.substring(0, buildingIds.length);

      var vm = this;
      this.$confirm(`确认要删除您选中的${len}条数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          vm.axios
            .delete("/api/buildings/delete", { data: { buildingIds } })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.getBuildings();
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
    setStatus(buildingId, status) {
      var vm = this;
      vm.axios
        .put("/api/buildings/setStatus", { buildingId, status })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.getBuildings();
          vm.$message({
            type: "success",
            message: `${status == 0 ? "启用" : "禁用"}成功！`
          });
        });
    },
    getZones(){
      var vm = this;
      this.axios
        .get("/api/zones/get", { params: { status: 0 } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          vm.form.zones = data.zones;
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
.el-select {
  width: 200px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 200px;
}
</style>


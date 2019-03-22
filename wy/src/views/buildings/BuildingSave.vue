<template>
    <div class="building-save">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'building' }">楼宇管理</el-breadcrumb-item>
            <el-breadcrumb-item>楼宇{{msg}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="buildingForm" :rules="rules" ref="buildingForm" label-width="100px" class="buildingForm">
            <el-form-item label="楼宇名称" prop="buildingName">
                <el-input v-model="buildingForm.buildingName" placeholder="请输入楼宇名称" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="所属小区" prop="zoneId">
                <el-select v-model="buildingForm.zoneId" placeholder="请选择" size="small" style="width:300px">
                  <el-option v-for="(z,index) in buildingForm.zones" :key="index" :label="z.zoneName" :value="z.zoneId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="层数" prop="layerCount">
                <el-input v-model="buildingForm.layerCount" placeholder="请输入层数" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="高度" prop="height">
                <el-input v-model="buildingForm.height" placeholder="请输入高度" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="area">
                <el-input v-model="buildingForm.area" placeholder="请输入建筑面积" size="small" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="建成日期" prop="buildTime">
                <el-date-picker type="date" v-model="buildingForm.buildTime" size="small" style="width:300px"></el-date-picker>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="buildingForm.type" placeholder="请选择" size="small" style="width:300px">
                  <el-option label="高层" :value="'高层'"></el-option>
                  <el-option label="多层" :value="'多层'"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="朝向" prop="direction">
                <el-select v-model="buildingForm.direction" placeholder="请选择" size="small" style="width:300px">
                  <el-option label="坐北朝南" :value="'坐北朝南'"></el-option>
                  <el-option label="坐西朝东" :value="'坐西朝东'"></el-option>
                  <el-option label="坐南朝北" :value="'坐南朝北'"></el-option>
                  <el-option label="坐东朝西" :value="'坐东朝西'"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('buildingForm')" size="small" icon="el-icon-check">{{msg}}</el-button>
                <el-button type="info" @click="resetForm('buildingForm')" size="small" icon="el-icon-close">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: "BuildingSave",
  computed: {
    edit() {
      return this.$route.query.edit;
    },
    buildingId() {
      return this.$route.query.buildingId;
    },
    msg() {
      return this.edit ? "编辑" : "添加";
    }
  },
  data() {
    return {
      buildingForm: {
        buildingName: "",
        zoneId: "",
        zones: [],
        layerCount: "",
        height: "",
        area: "",
        buildTime: null,
        type: "",
        direction: ""
      },
      rules: {
        buildingName: [
          { required: true, message: "请输入楼宇名称", trigger: "blur" }
        ],
        zoneId: [
          { required: true, message: "请输入所属小区", trigger: "blur" }
        ],
        direction: [{ required: true, message: "请输入朝向", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getZones();
    if (this.edit && this.buildingId) {
      this.getBuildings(this.buildingId);
    }
  },
  methods: {
    submitForm(formName) {
      var vm = this;

      this.$refs[formName].validate(valid => {
        if (valid) {
          vm.buildingForm.buildingId = vm.buildingId;
          vm
            .axios({
              method: vm.edit ? "PUT" : "POST",
              url: vm.edit ? "/api/buildings/put" : "/api/buildings/post",
              data: vm.buildingForm
            })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.$router.push({ name: "building" });
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getBuildings(buildingId) {
      var vm = this;
      this.axios
        .get("/api/buildings/get", { params: { buildingId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          var buildings = data.buildings[0];
          vm.buildingForm.buildingName = buildings.buildingName;
          vm.buildingForm.zoneId = buildings.zoneId;
          vm.buildingForm.layerCount = buildings.layerCount;
          vm.buildingForm.height = buildings.height;
          vm.buildingForm.area = buildings.area;
          var data = new Date(buildings.buildTime);
          vm.buildingForm.buildTime =
            data != "Invalid Date" ? data : new Date();
          vm.buildingForm.type = buildings.type;
          vm.buildingForm.direction = buildings.direction;
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
          vm.buildingForm.zones = data.zones;
        });
    }
  }
};
</script>

<style scoped>
.building-save {
  background-color: #fff;
  padding-top: 10px;
}
.buildingForm {
  padding: 25px !important;
}
</style>



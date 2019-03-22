<template>
  <div class="zone-save">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'zone' }">小区管理</el-breadcrumb-item>
        <el-breadcrumb-item>小区{{msg}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="zoneForm" :rules="rules" ref="zoneForm" label-width="110px" class="zoneForm" :inline="true">
      <el-form-item label="公司名称" prop="zoneName">
          <el-input v-model="zoneForm.zoneName" placeholder="请输入小区名称" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="所属公司" prop="companyId">
          <el-select v-model="zoneForm.companyId" placeholder="请选择" size="small" style="width:300px">
            <el-option v-for="(com,index) in zoneForm.companies" :key="index" :label="com.companyName" :value="com.companyId"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="联系小区负责人" prop="principal">
          <el-input v-model="zoneForm.principal" placeholder="请输入联系小区负责人" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话" prop="contact">
          <el-input v-model="zoneForm.contact" placeholder="请输入负责人电话" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="小区位置" prop="address">
          <el-input v-model="zoneForm.address" placeholder="请输入小区位置" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="建成时间" prop="buildTime">
          <el-date-picker type="date" v-model="zoneForm.buildTime" size="small" style="width:300px"></el-date-picker>
      </el-form-item>
      <el-form-item label="小区占地面积" prop="area">
          <el-input v-model="zoneForm.area" placeholder="请输入小区占地面积" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="建筑面积" prop="areaStructure">
          <el-input v-model="zoneForm.areaStructure" placeholder="请输入建筑面积" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="道路面积" prop="areaRoad">
          <el-input v-model="zoneForm.areaRoad" placeholder="请输入道路面积" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="高层楼宇数量" prop="houseCount">
          <el-input v-model="zoneForm.houseCount" placeholder="请输入高层楼宇数量" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="多层楼宇数量" prop="houseCount2">
          <el-input v-model="zoneForm.houseCount2" placeholder="请输入多层楼宇数量" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="车位数量" prop="carCount">
          <el-input v-model="zoneForm.carCount" placeholder="请输入车位数量" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="车库面积" prop="areaCar">
          <el-input v-model="zoneForm.areaCar" placeholder="请输入车库面积" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="公共场所面积" prop="areaPublic">
          <el-input v-model="zoneForm.areaPublic" placeholder="请输入公共场所面积" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="绿化面积" prop="areaGreen">
          <el-input v-model="zoneForm.areaGreen" placeholder="请输入绿化面积" size="small" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item class="w100">
          <el-button type="primary" @click="submitForm('zoneForm')" size="small" icon="el-icon-check">{{msg}}</el-button>
          <el-button type="info" @click="resetForm('zoneForm')" size="small" icon="el-icon-close">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ZoneSave",
  computed: {
    edit() {
      return this.$route.query.edit;
    },
    zoneId() {
      return this.$route.query.zoneId;
    },
    msg() {
      return this.edit ? "编辑" : "添加";
    }
  },
  data() {
    return {
      zoneForm: {
        zoneName: "",
        companyId: null,
        principal: "",
        contact: "",
        address: "",
        buildTime: null,
        area: "",
        areaStructure: "",
        areaRoad: "",
        houseCount: "",
        houseCount2: "",
        carCount: "",
        areaCar: "",
        areaPublic: "",
        areaGreen: "",
        companies: []
      },
      rules: {
        zoneName: [
          { required: true, message: "请输入小区名称", trigger: "blur" }
        ],
        companyId: [{ required: true, message: "请选择公司", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCompanies();
    if (this.edit && this.zoneId) {
      this.getZone(this.zoneId);
    }
  },
  methods: {
    submitForm(formName) {
      var vm = this;

      this.$refs[formName].validate(valid => {
        if (valid) {
          vm.zoneForm.zoneId = vm.zoneId;
          vm
            .axios({
              method: vm.edit ? "PUT" : "POST",
              url: vm.edit ? "/api/zones/put" : "/api/zones/post",
              data: vm.zoneForm
            })
            .then(function(response) {
              var data = response.data;
              if (data.code != 200) {
                vm.$alert(data.message, "提示", {
                  confirmButtonText: "确定"
                });
                return;
              }
              vm.$router.push({ name: "zone" });
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getZone(zoneId) {
      var vm = this;
      this.axios
        .get("/api/zones/get", { params: { zoneId } })
        .then(function(response) {
          var data = response.data;
          if (data.code != 200) {
            vm.$alert(data.message, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          var zone = data.zones[0];
          vm.zoneForm.zoneName = zone.zoneName;
          vm.zoneForm.companyId = zone.companyId;
          vm.zoneForm.principal = zone.principal;
          vm.zoneForm.contact = zone.contact;
          vm.zoneForm.address = zone.address;
          var data = new Date(zone.buildTime);
          vm.zoneForm.buildTime = data != "Invalid Date" ? data : new Date();
          vm.zoneForm.area = zone.area;
          vm.zoneForm.areaStructure = zone.areaStructure;
          vm.zoneForm.areaRoad = zone.areaRoad;
          vm.zoneForm.houseCount = zone.houseCount;
          vm.zoneForm.houseCount2 = zone.houseCount2;
          vm.zoneForm.carCount = zone.carCount;
          vm.zoneForm.areaCar = zone.areaCar;
          vm.zoneForm.areaPublic = zone.areaPublic;
          vm.zoneForm.areaGreen = zone.areaGreen;
        });
    },
    getCompanies() {
      var vm = this;
      this.axios.get("/api/companies/get", { status: 0}).then(function(response) {
        var data = response.data;
        if (data.code == 200) {
          vm.zoneForm.companies = data.companies;
        }
      });
    }
  }
};
</script>

<style scoped>
.zone-save {
  background-color: #fff;
  padding-top: 10px;
}
.zoneForm {
  padding: 25px !important;
}
.w100{
  width:100%
}
</style>



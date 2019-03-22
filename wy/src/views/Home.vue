<template>
  <div class="home">
    <el-container>
      <el-header class="header">
        <el-row>
          <el-col :span="12">
            <h2>管理系统</h2>
          </el-col>
          <el-col :span="12" class="right">
            当前用户：{{userInfo.userName}} &nbsp;&nbsp;
            <el-button type="danger" icon="el-icon-bell" @click="logoutSystem()">注销</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="main">
        <el-aside class="aside">
          <el-menu router>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>基本资料</span>
              </template>
              <el-menu-item index="company">
                <i class="el-icon-document"></i>
                <span slot="title">公司管理</span>
              </el-menu-item>
              <el-menu-item index="zone">
                <i class="el-icon-document"></i>
                <span slot="title">小区管理</span>
              </el-menu-item>
              <el-menu-item index="building">
                <i class="el-icon-document"></i>
                <span slot="title">楼宇管理</span>
              </el-menu-item>
              <el-menu-item index="house">
                <i class="el-icon-document"></i>
                <span slot="title">房间管理</span>
              </el-menu-item>
              <el-menu-item index="tenement">
                <i class="el-icon-document"></i>
                <span slot="title">住户管理</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-edit"></i>
                <span>财务管理</span>
              </template>
              <el-menu-item index="category">
                <i class="el-icon-document"></i>
                <span slot="title">收费类型</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-edit"></i>
                <span>其他管理</span>
              </template>
              <el-menu-item index="peripheral">
                <i class="el-icon-document"></i>
                <span slot="title">周边设施</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item index="user">
                <i class="el-icon-document"></i>
                <span slot="title">用户管理</span>
              </el-menu-item>
              <el-menu-item index="about">
                <i class="el-icon-document"></i>
                <span slot="title">关于</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="content">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "home",
  computed: {
    ...mapState({
      userInfo: "userInfo"
    })
  },
  methods: {
    ...mapMutations(["logout"]),
    logoutSystem() {
      var vm = this;
      vm.axios.post("/api/users/logout").then(function(response) {
        var data = response.data;
        if (data.code != 200) {
          vm.$alert(data.message, "提示", {
            confirmButtonText: "确定"
          });
          return;
        }
        vm.logout();
        vm.$router.push({ name: "login" });
      });
    }
  }
};
</script>

<style scoped>
.home .header {
  line-height: 60px;
  background-color: #409eff;
  color: #fff;
}
.home .header h2 {
  font-size: 20px;
  font-weight: normal;
}
.home .header a {
  color: #fff;
}
.home .header .right {
  text-align: right;
}
.home .main {
  height: calc(100vh - 60px);
}
.home .main .aside {
  border: none;
}
.home .main .content {
  padding: 0 10px !important;
  border-left: 1px solid #ddd;
}
.home .el-menu {
  border: none;
}
</style>


<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

a {
  color: #444;
  text-decoration: none;
}

a:hover {
  color: #409eff;
}

.app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}

.el-table th:nth-of-type(1) div.cell,
.el-table td:nth-of-type(1) div.cell {
  text-align: center !important;
}

.el-table th {
  background: #f5f4ef !important;
}

.el-form-item__label:before {
  content: "" !important;
}

.bg-white {
  background: #fff;
  padding: 10px 0;
}

.el-form-item__label {
  text-align: right !important;
}

.el-collapse {
  border: none !important;
}

.el-collapse-item__header {
  border: none !important;
  background-color: #f5f4ef !important;
  user-select: none;
}

.el-collapse-item__content {
  padding-bottom: 0 !important;
}

.el-breadcrumb {
  height: 50px;
  line-height: 50px !important;
  padding-left: 10px;
  background-color: #f5f4ef;
}
</style>

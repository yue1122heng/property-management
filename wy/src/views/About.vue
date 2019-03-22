<template>
  <div class="about">
    <p>本系统采用vue+vuex+node+mysql实现。</p>
    <p>如有问题,请联系<a href="mailto:ddy_dhj@163.com">作者</a>。</p>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style scoped>
.about {
  background-color: #fff;
  padding-top: 10px;
  color: #303133;
}

.w100{
  width:100%
}

p{
  margin: 0 auto 15px auto;
}

p a{
  color: blue;
  text-decoration: underline;
}
</style>


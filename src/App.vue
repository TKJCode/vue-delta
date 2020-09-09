<template>
  <div id="app">
    <!-- 一级路由 -->
    <!-- <keep-alive>
      <router-view v-if="isRouterAlive && $route.meta.keepAlive"></router-view>
    </keep-alive>-->

    <router-view v-if="isRouterAlive"></router-view>

    <!-- <router-view v-if="isRouterAlive && !$route.meta.keepAlive"></router-view> -->
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  created() {
    // app初始化 => 初始化本地存储的数据
    if(!localStorage.getItem('userData')) {
      localStorage.setItem('userData', "{}");
    }
    if(!localStorage.getItem('shopcartData')) {
      localStorage.setItem('shopcartData', "{}");
    }
    if(!localStorage.getItem('collectData')) {
      localStorage.setItem('collectData', "{}");
    }
    if(!localStorage.getItem('orderData')) {
      localStorage.setItem('orderData', "{}");
    }
    if(!localStorage.getItem('addressData')) {
      localStorage.setItem('addressData', "{}");
    }
    if(!localStorage.getItem('settlementData')) {
      localStorage.setItem('settlementData', "{}");
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="less">
// 全局样式
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  background-color: #f3f4f5;
}

// 预设样式
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.auto-img {
  width: 100%;
  display: block;
}
.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.two-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

<template>
  <div class="main">
    <!-- 二级路由插座 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- 底部导航栏 -->
    <van-tabbar
      v-model="active"
      active-color="#f2373b"
      inactive-color="#1e1e1e"
      @change="toggleTabBar"
    >
      <van-tabbar-item v-for="(item, index) in tabBarData" :key="index">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon_active : item.icon" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",

  data() {
    return {
      active: 0,

      // 底部导航栏数组
      tabBarData: [
        {
          title: "首页",
          icon: require("../assets/images/home.png"),
          icon_active: require("../assets/images/home_active.png"),
          routeName: "Home",
          hashUrl: "/main/home",
        },
        {
          title: "分类",
          icon: require("../assets/images/classify.png"),
          icon_active: require("../assets/images/classify_active.png"),
          routeName: "Classify",
          hashUrl: "/main/classify",
        },
        {
          title: "热卖",
          icon: require("../assets/images/hot.png"),
          icon_active: require("../assets/images/hot_active.png"),
          routeName: "Hot",
          hashUrl: "/main/hot",
        },
        {
          title: "购物车",
          icon: require("../assets/images/shopcart.png"),
          icon_active: require("../assets/images/shopcart_active.png"),
          routeName: "Shopcart",
          hashUrl: "/main/shopcart",
        },
        {
          title: "我的",
          icon: require("../assets/images/my.png"),
          icon_active: require("../assets/images/my_active.png"),
          routeName: "My",
          hashUrl: "/main/my",
        },
      ],
    };
  },

  created() {
    // 在初始化页面数据钩子函数后
    // 解决路由跳转底部 tab显示不正确的问题
    this.collectTab();
  },

  updated() {
    // 在更新数据钩子函数后
    // 解决路由跳转底部 tab显示不正确的问题
    this.collectTab();
  },

  methods: {
    // 切换底部 tab栏
    toggleTabBar(index) {
      // console.log('index =>', index);

      // 跳转路由
      this.$router.push({ name: this.tabBarData[index].routeName });
    },

    // 解决路由跳转底部 tab显示不正确的问题
    collectTab() {
      // 获取上方地址栏路径的 hash(把 "#" 截取)
      let hash = location.hash.slice(1);
      // console.log(hash)

      // 根据路径激活对应路由
      for (let i = 0; i < this.tabBarData.length; i++) {
        if (this.tabBarData[i].hashUrl == hash) {
          // 只有唯一一个,因此匹配到即刻 break
          this.active = i;
          break;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.van-tabbar {
  box-shadow: 0 0 10px 0 hsla(0, 6%, 58%, 0.6);
}
</style>
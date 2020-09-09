<template>
  <div class="skipSection">
    <div class="section-list">
      <div class="tri">
        <img class="auto-img tri-img" :src="require('../../assets/images/my_tri.png')" alt />
      </div>
      <div
        class="section-item clearfix"
        v-for="(item, index) in sectionData"
        :key="index"
        @click="goPage(item.routeName)"
      >
        <div class="section-icon fl">
          <img
            class="auto-img icon-img"
            :src="require('../../assets/images/my_' + item.icon + '.png')"
            alt
          />
        </div>
        <div class="section-text fl">{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "SkipSection",
  data() {
    return {
      // 跳转选项栏数据
      isShow: false,
      sectionData: [
        {
          title: "首页",
          icon: "home",
          routeName: "Home"
        },
        {
          title: "分类搜索",
          icon: "classify",
          routeName: "Classify"
        },
        {
          title: "热卖",
          icon: "hot",
          routeName: "Hot"
        },
        {
          title: "购物车",
          icon: "cart",
          routeName: "Shopcart"
        },
        {
          title: "我的乐享",
          icon: "user",
          routeName: "My"
        },
      ],
    };
  },

  methods: {
    // 跳转页面
    goPage(name) {
      if (name == name) {
        // 重新刷新本页页面
        this.reload();
      }
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="less" scoped>
.section-list {
  .tri {
    position: absolute;
    top: -5px;
    right: 5px;
    z-index: 1000;
    .tri-img {
      width: 10.5px;
      height: 5px;
    }
  }
  .section-item {
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.2);
    .section-icon {
      width: 40px;
      height: 40px;
      .icon-img {
        width: 15px;
        height: 15px;
        margin: 0 auto;
        padding-top: 12.5px;
      }
    }
    .section-text {
      width: calc(~"100% - 40px");
      color: #fff;
      font-size: 14px;
      line-height: 40px;
    }
    &:last-of-type {
      border-bottom: 0;
    }
  }
}
</style>
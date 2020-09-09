<template>
  <div class="nav-popup">
    <!-- 导航 -->
    <div class="popup-nav clearfix" @click="toggleShow" :class="{'show-nav': isShow}">
      <span class="nav-icon fl">
        <img class="auto-img" :style="{transform: isShow ? 'rotate(-180deg)' : ''}" :src="require('../../assets/images/detail_nav.png')" alt />
      </span>
      <span class="nav-text fl show" v-show="!isShow">快速导航</span>
      <span class="nav-text fl" v-show="isShow">收起</span>
    </div>

    <!-- 弹出层 -->
    <div class="popup" :class="{'show-popup': isShow}">
      <div class="popup-list clearfix">
        <div class="popup-item fl" v-for="(item, index) in navData" :key="index" @click="goPage(item.routeName)">
          <div class="popup-icon">
            <svg class="p-icon" aria-hidden="true">
              <use :xlink:href="'#icon-' + item.icon" />
            </svg>
          </div>
          <div class="popup-text">{{item.title}}</div>
        </div>
      </div>
    </div>

    <!-- mask -->
    <div class="mask" v-show="isShow"></div>
  </div>
</template>

<script>
export default {
  name: "NavPopup",
  data() {
    return {
      isShow: false,
      navData: [
        {
          title: '首页',
          icon: 'home',
          routeName: 'Home'
        },
        {
          title: '分类',
          icon: 'list',
          routeName: 'Classify'
        },
        {
          title: '热卖',
          icon: 'likes',
          routeName: 'Hot'
        },
        {
          title: '个人中心',
          icon: 'my',
          routeName: 'My'
        },
        {
          title: '搜索',
          icon: 'search',
          routeName: 'Search'
        },
        {
          title: '收藏',
          icon: 'collect',
          routeName: 'MyCollect'
        },
        {
          title: '足迹',
          icon: 'footprint',
          routeName: 'Home'
        },
        {
          title: '用户反馈',
          icon: 'feedback',
          routeName: 'Home'
        },
      ]
    };
  },
  methods: {
    // 跳转路由页面
    goPage(name) {
      this.$router.push({name});
    },

    // 切换状态
    toggleShow() {
      this.isShow = !this.isShow;
    }
  }
};
</script>

<style lang="less" scoped>
.nav-popup {
  .popup-nav {
    width: 60px;
    height: 40px;
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 72%;
    right: 0;
    z-index: 9999;
    margin-top: -20px;
    border-radius: 4px 0 0 4px;
    transition: right 0.3s;
    .nav-icon {
      display: block;
      width: 20px;
      height: 20px;
      margin-top: 10px;
      margin-left: 5px;
    }
    .nav-text {
      height: 40px;
      display: block;
      color: #fff;
      font-size: 10px;
      width: 30px;
      box-sizing: border-box;
      line-height: 40px;
    }
    .nav-text.show {
      line-height: 13px;
      margin-top: 7.5px;
    }
  }
  .popup-nav.show-nav {
    right: 260px;
  }
  .popup {
    width: 260px;
    height: 102px;
    padding: 15px 0 5px;
    background: #fff;
    border-radius: 4px 0 0 4px;
    position: fixed;
    top: calc(~"72% - 61px");
    right: -260px;
    z-index: 9999;
    transition: right 0.3s;
    border: 1px solid #eee;
    border-right: 0;
    .popup-list {
      width: 100%;
      .popup-item {
        width: 100%/4;
        padding: 5px 0;
        .popup-icon {
          width: 20px;
          height: 20px;
          .p-icon {
            width: 2em;
            height: 2em;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
            margin-left: 20.5px;
          }
        }
        .popup-text {
          margin: 4px 0 0;
          padding: 0 5px;
          color: #666;
          font-size: 10px;
          text-align: center;
        }
      }
    }
  }
  .popup.show-popup {
    right: 0;
  }
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s;
  }
}
</style>
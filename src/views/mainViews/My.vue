<template>
  <div class="my">
    <!-- 顶部标题栏 -->
    <div class="top-title">
      <van-nav-bar title="我的乐享" left-arrow :fixed="true" @click-left="goBack">
        <template #right>
          <van-icon name="ellipsis" color="#5E606B" size=".7rem" @click="showItems" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 跳转选项栏 -->
    <div class="my-section" v-show="isShow">
      <SkipSection></SkipSection>
    </div>

    <!-- 个人信息栏 -->
    <div class="my-info">
      <!-- 账户设置 -->
      <div class="my-set">
        <span class="set-icon">
          <img class="auto-img set-img" :src="require('../../assets/images/my_set.png')" alt />
        </span>
        <span class="set-text">账户设置</span>
      </div>
      <!-- 用户栏 -->
      <div class="my-user clearfix">
        <!-- 头像 -->
        <div class="my-header fl">
          <img class="auto-img head-img" :src="require('../../assets/images/my_head.png')" alt />
        </div>
        <!-- 用户名 -->
        <div class="my-name fl">
          <div class="name-top">
            <span class="top-nickName">jdd1233ddddd</span>
            <span class="top-icon">
              <img
                class="auto-img modify-img"
                :src="require('../../assets/images/my_modify.png')"
                alt
              />
            </span>
          </div>
          <div class="name-middle">
            <span class="middle-text">用户名：jdd1233ddddd</span>
          </div>
        </div>
      </div>
      <!-- 会员 -->
      <div class="my-plus">
        <div class="plus-img">
          <img class="auto-img bg-img" :src="require('../../assets/images/my_bg.png')" alt />
        </div>
        <div class="plus-text">
          <span class="plus-left">
            <img class="auto-img plus-icon" :src="require('../../assets/images/my_plus.png')" alt />
          </span>
          <span class="plus-line"></span>
          <span class="plus-middle">免费试用&nbsp;立领1张运费券</span>
          <span class="plus-right clearfix">
            <div class="fl">0元试用</div>
            <div class="fl icon-arrow">
              <img
                class="auto-img plus-icon"
                src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 20'%3E%3Cpath fill='%23FFE678' fill-rule='evenodd' d='M2 20c-.8 0-1.5-.5-1.8-1.2-.3-.8-.2-1.6.4-2.2L7.2 10 .6 3.4c-.8-.8-.8-2 0-2.8.8-.8 2-.8 2.8 0l8 8c.4.4.6 1 .6 1.4 0 .5-.2 1-.6 1.4l-8 8c-.4.4-1 .6-1.4.6z'/%3E%3C/svg%3E"
                alt
              />
            </div>
          </span>
        </div>
      </div>
    </div>

    <!-- 订单栏 -->
    <div class="my-order">
      <div class="order-list clearfix">
        <div class="order-item fl" v-for="(item, index) in myOrderData" :key="index">
          <div class="order-icon">
            <img
              class="auto-img order-img"
              :src="require('../../assets/images/my_' + item.icon + '.png')"
              alt
            />
          </div>
          <div class="order-text">{{item.title}}</div>
        </div>
        <div class="order-item fl">
          <div class="order-icon">
            <img
              class="auto-img order-img"
              :src="require('../../assets/images/my_orders.png')"
              alt
            />
          </div>
          <div class="order-arrow">
            <img class="auto-img" :src="require('../../assets/images/my_arrow_right.png')" alt="">
          </div>
          <div class="order-text">全部订单</div>
        </div>
      </div>
    </div>

    <!-- 资产栏 -->
    <div class="my-assets">
      <div class="assets-list clearfix">
        <div class="assets-item fl" v-for="(item, index) in myAssetsData" :key="index">
          <div class="assets-top">
            <span>{{item.num}}</span>
            <span class="assets-unit">{{item.unit}}</span>
          </div>
          <div class="assets-tag" v-if="item.isTag">立减40元</div>
          <div class="assets-bottom">{{item.title}}</div>
        </div>
        <div class="assets-item fl">
          <div class="assets-top">
            <img class="auto-img assets-img" :src="require('../../assets/images/my_assets.png')" alt="">
          </div>
          <div class="assets-arrow">
            <img class="auto-img" :src="require('../../assets/images/my_arrow_right.png')" alt="">
          </div>
          <div class="assets-bottom">我的资产</div>
        </div>
      </div>
    </div>

    <!-- 收藏栏 -->
    <div class="my-collect">
      <div class="collect-list clearfix">
        <div class="collect-item fl" v-for="(item, index) in myCollectData" :key="index" @click="goPage(item.routeName)">
          <div class="collect-num">{{index == 0 ? collectCount : item.count}}</div>
          <div class="collect-text">{{item.title}}</div>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="my-tools">
      <div class="tools-list clearfix">
        <div class="tools-item fl" v-for="(item, index) in myToolsData" :key="index">
          <div class="tools-icon">
            <img
              class="auto-img"
              :src="require('../../assets/images/my_list' + item.iconNo + '.webp')"
              alt
            />
          </div>
          <div class="tools-text">{{item.title}}</div>
        </div>
      </div>
    </div>

    <!-- 商品推荐栏 -->
    <div class="my-recommend">
      <div class="recommend-title">
        <span class="recommend-text">为您推荐</span>
      </div>
      <Recommend></Recommend>
    </div>
  </div>
</template>

<script>
// 引入样式
import "../../assets/css/mainCss/my.less";

export default {
  name: "My",
  data() {
    return {
      // 跳转选项栏数据
      isShow: false,
      sectionData: [
        {
          title: "首页",
          icon: "home",
          routeName: "Home",
        },
        {
          title: "分类搜索",
          icon: "classify",
          routeName: "Classify",
        },
        {
          title: "购物车",
          icon: "cart",
          routeName: "Shopcart",
        },
        {
          title: "我的乐享",
          icon: "user",
          routeName: "My",
        },
      ],
      myOrderData: [
        {
          title: "待付款",
          icon: "paid",
        },
        {
          title: "待收货",
          icon: "received",
        },
        {
          title: "退换 / 售后",
          icon: "aftersale",
        }
      ],
      myAssetsData: [
        {
          title: '乐享券',
          num: '0',
          unit: '张',
          isTag: false
        },
        {
          title: '白条',
          num: '',
          unit: '开通有礼',
          isTag: true
        },
        {
          title: '乐豆',
          num: '0',
          unit: '个',
          isTag: false
        },
        {
          title: '红包',
          num: '0',
          unit: '元',
          isTag: false
        }
      ],
      myCollectData: [
        {
          title: "商品收藏",
          count: 0,
          routeName: 'MyCollect'
        },
        {
          title: "店铺收藏",
          count: 0,
          routeName: ''
        },
        {
          title: "我的足迹",
          count: 0,
          routeName: ''
        },
      ],
      myToolsData: [
        {
          title: "我的预约",
          iconNo: "01",
        },
        {
          title: "高价回收",
          iconNo: "02",
        },
        {
          title: "乐享火车票",
          iconNo: "03",
        },
        {
          title: "应用推荐",
          iconNo: "04",
        },
        {
          title: "乐享机票",
          iconNo: "05",
        },
        {
          title: "乐享酒店",
          iconNo: "06",
        },
        {
          title: "闲置换钱",
          iconNo: "07",
        },
      ],
      
      userAccount: '',
      collectLocal: {},
      collectCount: '',

    };
  },

  created() {
    // 获取本地存储的用户账号
    this.userAccount = localStorage.getItem("userData");

    // 从本地存储中获取收藏商品数据
    this.collectLocal = JSON.parse(localStorage.getItem("collectData"));
    // 显示购物车条数
    this.collectCount = Object.keys(this.collectLocal[this.userAccount]).length;
  },

  methods: {
    // 加载提示
    toastLoad() {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示(如果值为 0,则不会自动关闭)
        duration: 0,
      });
    },

    // 跳转页面
    goPage(name) {
      this.$router.push({ name });
    },

    // 返回上一级页面
    goBack() {
      this.$router.go(-1);
    },

    // 展示跳转选项
    showItems() {
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
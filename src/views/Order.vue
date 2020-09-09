<template>
  <div class="order">
    <!-- 顶部标题栏 -->
    <div class="top-title">
      <van-nav-bar title="我的订单" left-arrow :fixed="true" @click-left="goBack">
        <template #right>
          <van-icon name="ellipsis" color="#5E606B" size=".7rem" @click="isShow = !isShow" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 跳转选项栏 -->
    <div class="my-section" v-show="isShow">
      <SkipSection></SkipSection>
    </div>

    <!-- 标签页 -->
    <div class="order-tabs">
      <van-tabs v-model="activeStatus" @change="getSettlementByLocal" swipeable sticky>
        <van-tab
          v-for="(item, index) in tabsData"
          :title="item.title"
          :name="item.name"
          :key="index"
        >
          <!-- 订单列表 -->
          <div class="tabs-list">
            <div class="tabs-item" v-for="(items, keys, indexs) in orderInfo" :key="indexs">
              <div class="item-top clearfix">
                <span class="top-no fl">NO{{keys}}</span>
                <span class="top-chose fr" v-show="!items.isReceived" @click="clickIsReceived(items)">确认收货</span>
                <span class="top-chose fr clearfix" v-show="items.isReceived">
                  <div class="fl">删除</div>
                  <div class="fl del-icon">
                    <van-icon name="delete" />
                  </div>
                </span>
              </div>
              <div class="item-middle clearfix" v-for="(v, i) in items.data" :key="i">
                <div class="middle-img fl">
                  <img class="auto-img" v-lazy="v.goods_img" alt />
                </div>
                <div class="middle-text fl">
                  <div class="text-title two-text">{{v.goods_name}}</div>
                  <div class="text-sku clearfix">规格：{{v.goods_sku}}，重量：{{v.goods_weight}}</div>
                  <div class="text-price clearfix">
                    <span class="price-num fl">￥{{v.goods_price}}.00</span>
                    <span class="price-count fr">×{{v.goods_num}}</span>
                  </div>
                </div>
              </div>
              <div class="item-bottom clearfix">
                <span class="bottom-date fl">2020-08-31 09:05:46</span>
                <span class="bottom-price fr">￥{{getSumPrice(items.data)}}</span>
                <span class="bottom-count fr">共计 {{getSumCount(items.data)}} 件商品 合计：</span>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
// 引入样式
import "../assets/css/order.less";

export default {
  name: "Order",
  data() {
    return {
      isShow: false,
      activeStatus: "0", //订单状态码(0: 全部，1: 待收货，2: 已收货)
      tabsData: [
        {
          title: "全部",
          name: "0",
        },
        {
          title: "待收货",
          name: "1",
        },
        {
          title: "已收货",
          name: "2",
        },
      ],
      settlementData: {},
      orderList: [],
      orderNo: "",
      isReceived: false,
      orderInfo: {},
    };
  },
  created() {
    // 获取本地存储数据
    this.userAccount = localStorage.getItem("userData");

    // 获取本地存储中的结算数据
    this.getSettlementByLocal();
  },

  methods: {
    // 跳转页面
    goPage(name) {
      this.$router.push({ name });
    },

    // 返回上一级页面
    goBack() {
      this.$router.go(-1);
    },

    // 获取总价和总数量
    getSumPrice(item) {
      let totalPrice = 0;
      for (let i in item) {
        totalPrice += item[i].goods_price * item[i].goods_num;
      }
      return totalPrice;
    },
    getSumCount(item) {
      let totalCount = 0;
      for (let i in item) {
        totalCount += item[i].goods_num;
      }
      return totalCount;
    },

    // 获取本地存储中的结算数据
    getSettlementByLocal() {
      this.settlementData = JSON.parse(localStorage.getItem("settlementData"))[
        this.userAccount
      ];

      if (this.activeStatus == "0") {
        this.orderList = this.settlementData.orderAll;
      } else if (this.activeStatus == "1") {
        this.orderList = this.settlementData.orderAwait;
      } else if (this.activeStatus == "2") {
        this.orderList = this.settlementData.orderReceived;
      }
      console.log(this.orderList);

      for(let key in this.orderList) {
        // console.log(this.orderList[key]);
        this.orderInfo = Object.assign(this.orderInfo, {
          [key]: {
            data: this.orderList[key],
            isReceived: this.isReceived
          }
        })
      console.log(this.orderInfo[key]);
      }
      
      // console.log(this.orderList);
    },

    // 点击 "确认收货"
    clickIsReceived(item) {
      item.isReceived = true;
      console.log(item.isReceived);
      console.log(this.orderInfo);
      this.$forceUpdate();
    },
  },
};
</script>
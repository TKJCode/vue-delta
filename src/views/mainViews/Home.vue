<template>
  <div class="home">
    <div class="top-bg"></div>
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <van-row class="vanRow">
        <van-col span="4" class="vanCol-icon">
          <svg class="icon" aria-hidden="true" @click="goPage('Classify')">
            <use xlink:href="#icon-classify" />
          </svg>
        </van-col>
        <van-col span="16">
          <van-search show-action label="DTS" placeholder="DELTA SuperMall" @click="goPage('Search')" />
        </van-col>
        <van-col span="4" class="vanCol-text" @click="goPage('Login')">登录</van-col>
      </van-row>
    </div>

    <!-- 顶部轮播图 -->
    <div class="top-swipe">
      <van-swipe
        class="my-swipe"
        :autoplay="3000"
        indicator-color="white"
        style="height: 136.51px;"
      >
        <van-swipe-item v-for="(item, index) in bannerData" :key="index">
          <img class="auto-img" v-lazy="item" alt />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 广告栏 -->
    <div class="advertise-box clearfix">
      <div class="advertise-img fl" v-for="(item, index) in advertiseData" :key="index">
        <img class="auto-img" v-lazy="item" alt />
      </div>
    </div>

    <!-- 盒子列表 -->
    <div class="box-list">
      <div class="box-all clearfix">
        <div class="box-item fl" v-for="(item, index) in boxListData" :key="index">
          <div class="box-icon">
            <img class="auto-img" v-lazy="item.url" alt />
          </div>
          <div class="box-text">{{item.title}}</div>
        </div>
      </div>
    </div>

    <!-- 秒杀栏 -->
    <div class="sale-box">
      <div class="sale-top clearfix">
        <span class="sale-title fl">乐享秒杀</span>
        <span class="sale-time fl">
          <van-count-down :time="time">
            <template v-slot="timeData">
              <span class="time-all clearfix">
                <span class="time-left fl">10点场</span>
                <span class="time-right fr">
                  <span class="block">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="block">{{ timeData.seconds }}</span>
                </span>
              </span>
            </template>
          </van-count-down>
        </span>
        <span class="sale-more fr">
          更多秒杀
          <svg class="icon arrow" aria-hidden="true">
            <use xlink:href="#icon-sale-arrow-right" />
          </svg>
        </span>
      </div>
      <div class="sale-products clearfix">
        <div class="sale-products-item fl" v-for="(item, index) in saleData" :key="index" @click="goDetail(item)">
          <div class="sale-img">
            <img class="auto-img" v-lazy="item.imgPath" alt />
          </div>
          <div class="sale-price">
            <div class="sale-price-top">￥{{item.salePri}}</div>
            <div class="sale-price-bottom">￥{{item.costPri}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品卡片栏 -->
    <div class="card-box clearfix">
      <div class="card-img fl">
        <img class="auto-img" v-lazy="require('../../assets/images/card_01.png')" alt />
      </div>
      <div class="card-img fl">
        <img class="auto-img" v-lazy="require('../../assets/images/card_02.png')" alt />
      </div>
    </div>
    <div class="card-box" style="margin: 0;">
      <img class="auto-img" v-lazy="require('../../assets/images/card_03.png')" alt />
    </div>

    <!-- 推荐商品栏 -->
    <!-- 1.东家小院 -->
    <div class="rec-floor-one">
      <!-- 标题栏 -->
      <div class="title-bg">
        <img class="auto-img" v-lazy="require('../../assets/images/recommend_01.png')" alt />
      </div>
      <!-- 商品栏 -->
      <div class="one-box">
        <div class="one-top clearfix">
          <div
            class="top-item fl"
            v-for="(item, index) in recOneData.top"
            :key="index"
            @click="goGoodsList(item)"
          >
            <div class="top-title">
              <div class="top-big-title">{{item.bigTitle}}</div>
              <div class="top-small-title">{{item.smallTitle}}</div>
            </div>
            <div class="top-products clearfix">
              <div class="products-item fl" v-for="(v, i) in item.imgPath" :key="i">
                <img class="auto-img" v-lazy="v.src" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="one-bottom clearfix">
          <div
            class="bottom-item fl"
            v-for="(item, index) in recOneData.bottom"
            :key="index"
            @click="goGoodsList(item)"
          >
            <div class="bottom-title">
              <div class="bottom-big-title">{{item.bigTitle}}</div>
              <div class="bottom-small-title">{{item.smallTitle}}</div>
            </div>
            <div class="bottom-products">
              <img class="auto-img" v-lazy="item.imgPath" alt />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2.每日逛 -->
    <div class="rec-floor-two">
      <!-- 标题栏 -->
      <div class="title-bg">
        <img class="auto-img" v-lazy="require('../../assets/images/recommend_02.png')" alt />
      </div>
      <!-- 商品栏 -->
      <div class="one-box">
        <div class="one-bottom clearfix">
          <div class="bottom-item fl" v-for="(item, index) in recTwoData" :key="index" @click="goGoodsList(item)">
            <div class="bottom-title">
              <div
                class="bottom-big-title"
                :style="{'background': '-webkit-linear-gradient(left,' + item.fontLeft + ',' + item.fontRight + ')'}"
                style="background: linear-gradient(90deg, #FF2A2A,#F139D2);-webkit-background-clip: text;color: transparent;"
              >{{item.bigTitle}}</div>
              <div class="bottom-small-title">{{item.smallTitle}}</div>
            </div>
            <div class="bottom-products">
              <img class="auto-img" v-lazy="item.imgPath" alt />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3.为你推荐 -->
    <div class="rec-floor-three">
      <!-- 标题栏 -->
      <div class="title-bg-three">
        <img class="auto-img" v-lazy="require('../../assets/images/recommend_03.png')" alt />
      </div>
      <!-- 商品栏 -->
      <div class="my-recommend">
        <Recommend></Recommend>
      </div>
    </div>
  </div>
</template>

<script>
// 导入样式
import "../../assets/css/mainCss/home.less";

// 导入字体文件
import "../../assets/js/iconfont";

export default {
  name: "Home",

  data() {
    return {
      // 轮播图数据
      bannerData: [
        require("../../assets/images/banner_01.jpg"),
        require("../../assets/images/banner_02.jpg"),
        require("../../assets/images/banner_03.jpg"),
        require("../../assets/images/banner_04.jpg"),
        require("../../assets/images/banner_05.jpg"),
        require("../../assets/images/banner_06.jpg"),
        require("../../assets/images/banner_07.jpg"),
        require("../../assets/images/banner_08.jpg"),
      ],

      // 广告栏数据
      advertiseData: [
        require("../../assets/images/advertise_01.png"),
        require("../../assets/images/advertise_02.png"),
        require("../../assets/images/advertise_03.png"),
      ],

      // 盒子列表数据
      boxListData: [
        {
          title: "乐享超市",
          url: require("../../assets/images/boxList_01.webp"),
        },
        {
          title: "乐享服饰",
          url: require("../../assets/images/boxList_02.webp"),
        },
        {
          title: "乐享生鲜",
          url: require("../../assets/images/boxList_03.webp"),
        },
        {
          title: "乐享旅行",
          url: require("../../assets/images/boxList_04.webp"),
        },
        {
          title: "乐享国际",
          url: require("../../assets/images/boxList_05.webp"),
        },
        {
          title: "数码电器",
          url: require("../../assets/images/boxList_06.webp"),
        },
        {
          title: "化妆馆",
          url: require("../../assets/images/boxList_07.webp"),
        },
        {
          title: "9.9元拼",
          url: require("../../assets/images/boxList_08.webp"),
        },
        { title: "领券", url: require("../../assets/images/boxList_09.webp") },
        {
          title: "PLUS会员",
          url: require("../../assets/images/boxList_10.webp"),
        },
      ],

      // 秒杀倒计时
      time: 12 * 60 * 60 * 1000,

      // 秒杀限时购数据
      saleData: [
        {
          imgPath: require("../../assets/images/sale_01.jpg"),
          salePri: "3598",
          costPri: "3998",
          keywords: '滤水器',
          goodsId: '32635'
        },
        {
          imgPath: require("../../assets/images/sale_02.jpg"),
          salePri: "449",
          costPri: "599",
          keywords: '破壁机',
          goodsId: '38550'
        },
        {
          imgPath: require("../../assets/images/sale_03.jpg"),
          salePri: "899",
          costPri: "1299",
          keywords: '手表',
          goodsId: '25922'
        },
        {
          imgPath: require("../../assets/images/sale_04.jpg"),
          salePri: "499",
          costPri: "2499",
          keywords: 'Apple',
          goodsId: '51216'
        },
      ],

      // 推荐栏数据
      // 1.东家小院数据
      recOneData: {
        top: [
          {
            bigTitle: "品质生活",
            smallTitle: "讲究是一种生活态度",
            imgPath: [
              { src: require("../../assets/images/top_products_01.jpg") },
              { src: require("../../assets/images/top_products_02.jpg") },
            ],
            keywords: "4G手机",
          },
          {
            bigTitle: "科普好书",
            smallTitle: "精选优秀科普好书",
            imgPath: [
              { src: require("../../assets/images/top_products_03.jpg") },
              { src: require("../../assets/images/top_products_04.jpg") },
            ],
            keywords: "书籍",
          },
        ],
        bottom: [
          {
            bigTitle: "烘焙用油",
            smallTitle: "尝新烘焙油",
            imgPath: require("../../assets/images/top_products_05.jpg"),
            keywords: "烘焙",
          },
          {
            bigTitle: "棉装夏装",
            smallTitle: "居家必选",
            imgPath: require("../../assets/images/top_products_06.jpg"),
            keywords: "上衣",
          },
          {
            bigTitle: "无畏时光",
            smallTitle: "自身魅力",
            imgPath: require("../../assets/images/top_products_07.jpg"),
            keywords: "凉鞋",
          },
          {
            bigTitle: "时尚男鞋",
            smallTitle: "舒适男鞋",
            imgPath: require("../../assets/images/top_products_08.jpg"),
            keywords: "男鞋",
          },
        ],
      },

      // 2.每日逛数据
      recTwoData: [
        {
          bigTitle: "免息星球",
          smallTitle: "免息购",
          fontLeft: "#FF2A2A",
          fontRight: "#F139D2",
          imgPath: require("../../assets/images/rec_products_01.jpg"),
          keywords: '免息'
        },
        {
          bigTitle: "每日特价",
          smallTitle: "9块9疯抢",
          fontLeft: "#FE8537",
          fontRight: "#F02B2B",
          imgPath: require("../../assets/images/rec_products_02.jpg"),
          keywords: '特价'
        },
        {
          bigTitle: "品牌闪购",
          smallTitle: "汇大牌好价",
          fontLeft: "#FF765C",
          fontRight: "#FF23B3",
          imgPath: require("../../assets/images/rec_products_03.png"),
          keywords: '花花公子'
        },
        {
          bigTitle: "乐享直播",
          smallTitle: "边看边买",
          fontLeft: "#FF2A00",
          fontRight: "#FF00AF",
          imgPath: require("../../assets/images/rec_products_04.jpg"),
          keywords: 'Apple'
        },
        {
          bigTitle: "排行榜",
          smallTitle: "专属购物指南",
          fontLeft: "#D400FF",
          fontRight: "#FF320A",
          imgPath: require("../../assets/images/rec_products_05.jpg"),
          keywords: 'Xiaomi'
        },
        {
          bigTitle: "拍拍好物",
          smallTitle: "二手优品",
          fontLeft: "#00C2AB",
          fontRight: "#3E94FF",
          imgPath: require("../../assets/images/rec_products_06.png"),
          keywords: '笔记本'
        },
        {
          bigTitle: "新品首发",
          smallTitle: "乐享小魔方",
          fontLeft: "#FF765C",
          fontRight: "#FF23B3",
          imgPath: require("../../assets/images/rec_products_07.png"),
          keywords: '平板'
        },
        {
          bigTitle: "发现好货",
          smallTitle: "发现品质生活",
          fontLeft: "#2AD396",
          fontRight: "#85BB1F",
          imgPath: require("../../assets/images/rec_products_08.png"),
          keywords: '入耳式耳机'
        },
      ],

      loading: false,
      finished: false,
    };
  },

  methods: {
    // 跳转页面
    goPage(name) {
      this.$router.push({ name });
    },

    // 获取关键词跳转到商品列表
    goGoodsList(item) {
      this.$router.push({
        name: "GoodsList",
        query: {
          keywords: item.keywords,
        },
      });
    },

    // 获取关键词和商品 id跳转到详情页面
    goDetail(item) {
      this.$router.push({
        name: "Detail",
        query: {
          keywords: item.keywords,
          goods_id: item.goodsId
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
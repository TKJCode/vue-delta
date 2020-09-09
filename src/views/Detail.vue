<template>
  <div class="detail">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <van-row class="vanRow">
        <van-col span="2" offset="1">
          <div class="circle-bg">
            <svg class="icon" aria-hidden="true" @click="goBack">
              <use xlink:href="#icon-arrow-left" />
            </svg>
          </div>
        </van-col>
        <van-col span="2" offset="15">
          <div class="circle-bg" @click="showShare=true">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-share" />
            </svg>
          </div>
        </van-col>
        <van-col span="2" offset="1">
          <div class="circle-bg" @click="goPage('Shopcart')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shopcart" />
            </svg>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 侧部导航栏 -->
    <Nav-popup></Nav-popup>

    <!-- 图片栏 -->
    <div class="detail-swipe">
      <van-swipe @change="onChange" :autoplay="3000" v-if="swipeData.length != 0">
        <van-swipe-item v-for="(item, index) in swipeData" :key="index">
          <img class="auto-img" v-lazy="item.pics_mid_url" alt />
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">{{ current + 1 }}&nbsp;/&nbsp;{{swipeData.length}}</div>
        </template>
      </van-swipe>
      <div v-if="swipeData.length == 0">
        <img class="auto-img" :src="require('../assets/images/empty_goods.png')" alt />
      </div>
    </div>

    <!-- 倒计时组件 -->
    <div class="count-down clearfix" v-if="swipeData.length != 0">
      <div class="count-time fl clearfix">
        <div class="time-icon fl">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time" />
          </svg>
        </div>
        <div class="time-text">距离结束</div>
      </div>
      <van-count-down class="fl" :time="time">
        <template v-slot="timeData">
          <span class="block">{{ timeData.hours }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.minutes }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.seconds }}</span>
        </template>
      </van-count-down>
    </div>
    <div class="empty-down" v-if="swipeData.length == 0">图片加载失败...</div>

    <!-- 商品标题栏 -->
    <div class="goods-title">
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="info-name">{{detailData.goods_name}}</div>
        <div class="info-pri clearfix">
          <div class="price fl" v-if="detailData.goods_price != '0'">￥{{detailData.goods_price}}.00</div>
          <div class="price fl" v-if="detailData.goods_price == '0'">￥499</div>
          <div class="sold fl">已售{{detailData.goods_number}}</div>
        </div>
      </div>
    </div>

    <!-- 商品规格栏 -->
    <div class="goods-sku">
      <van-sku
        v-model="show"
        :sku="sku"
        :goods="goods_info"
        :goods-id="goods_id"
        :initial-sku="initialSku"
        :hide-stock="sku.hide_stock"
        :reset-stepper-on-hide="true"
        :reset-selected-sku-on-hide="true"
        :disable-stepper-input="true"
        :close-on-click-overlay="true"
        @buy-clicked="onBuyClicked"
        @add-cart="addShopcart"
        ref="getSku"
      />
      <van-button block @click="show = true">
        <div class="sku-list clearfix">
          <span class="sku-title fl">选择</span>
          <span class="sku-text fl one-text">请选择规格</span>
          <svg class="icon fl" aria-hidden="true">
            <use xlink:href="#icon-arrow-right-999" />
          </svg>
        </div>
      </van-button>
    </div>

    <!-- 商品属性栏 -->
    <div class="goods-attr" @click="isShow=true">
      <div class="attr-title">参数</div>
      <div class="attr-text fl one-text">{{attrs}}</div>
      <div>
        <svg class="icon fl" aria-hidden="true">
          <use xlink:href="#icon-arrow-right-999" />
        </svg>
      </div>
    </div>

    <!-- 动作面板 -->
    <van-action-sheet class="goods-action" v-model="isShow" title="基本信息" cancel-text="确定">
      <div class="action-list">
        <div class="action-item clearfix" v-for="(item, index) in attrsData" :key="index">
          <div class="action-title fl">{{item.attr_name}}</div>
          <div class="action-text fl">{{item.attr_value}}</div>
        </div>
      </div>
    </van-action-sheet>

    <!-- 热销排行和猜你喜欢 -->
    <div class="goods-tab">
      <van-tabs v-model="activeTab" animated swipeable>
        <van-tab v-for="(item, index) in tabGoods" :key="index">
          <template #title>
            <svg class="icon tab-icon" aria-hidden="true">
              <use :xlink:href="item.icon" />
            </svg>
            <span>{{item.tabTitle}}</span>
          </template>

          <!-- 商品列表 -->
          <div class="tab-list clearfix">
            <div
              class="tab-item fl"
              v-for="(v, i) in item.goodsList"
              :key="i"
              @click="changeQuery(index, i)"
            >
              <div class="tab-top">
                <img
                  class="auto-img tab-img"
                  v-if="v.goods_small_logo == ''"
                  :src="require('../assets/images/empty_goods.png')"
                  alt
                />
                <img class="auto-img tab-img" v-else v-lazy="v.goods_small_logo" alt />
              </div>
              <div class="tab-bottom">
                <div class="tab-title">{{v.goods_name}}</div>
                <div class="tab-price" v-if="v.goods_price == '0'">￥499</div>
                <div class="tab-price" v-else>￥{{v.goods_price}}</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 商品介绍栏 -->
    <div class="goods-introduce">
      <div class="introduce-title">
        <div class="introduce-text">商品介绍</div>
      </div>
      <div class="introduce-img" v-html="introduceData"></div>
    </div>

    <!-- 分享面板 -->
    <van-share-sheet v-model="showShare" title="分享到" :options="options" />

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <van-goods-action>
        <van-goods-action-icon
          @click="goodsCollect"
          :icon="isCollect ? 'star' : 'star-o'"
          :text="isCollect ? '已收藏' : '收藏'"
          :color="isCollect ? '#f2373b' : ''"
        />
        <van-goods-action-icon
          icon="cart-o"
          :badge="shopcartCount == 0 ? '' : shopcartCount"
          text="购物车"
          @click="goPage('Shopcart')"
        />
        <van-goods-action-button color="#FF6767" type="warning" text="加入购物车" @click="show = true" />
        <van-goods-action-button color="#f2373b" type="danger" text="立即购买" @click="show = true" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
// 导入样式
import "../assets/css/detail.less";

// 导入字体文件
import "../assets/js/iconfont";

export default {
  inject: ["reload"],
  name: "Detail",

  data() {
    return {
      // 商品 id和关键词
      goodsId: "",
      keywords: "",

      // 轮播图下标
      current: 0,

      // 商品详情数据
      detailData: [],

      // 轮播图数据
      swipeData: [],

      // 商品属性数据
      attrs: "",
      attrsData: [],

      // 下拉面板展示
      isShow: false,

      // 商品介绍图片栏
      introduceData: "",

      // tab栏
      activeTab: 0,

      // Tab标签栏
      hotGoods: [],
      tabGoods: [
        {
          tabTitle: "热销排行",
          icon: "#icon-hot",
        },
        {
          tabTitle: "猜你喜欢",
          icon: "#icon-heart",
        },
      ],

      // 分享面板
      showShare: false,
      options: [
        [
          { name: "微信", icon: "wechat" },
          { name: "微博", icon: "weibo" },
          { name: "QQ", icon: "qq" },
        ],
        [
          { name: "复制链接", icon: "link" },
          { name: "分享海报", icon: "poster" },
          { name: "二维码", icon: "qrcode" },
        ],
      ],

      // ================================

      // 倒计时
      time: 24 * 60 * 60 * 1000,

      // ================================

      // 商品规格
      show: false,
      // 商品 sku数据
      sku: {
        tree: [
          {
            k: "规格",
            k_id: "1",
            v: [
              {
                id: "11",
                name: "规格1",
                imgUrl: "",
              },
              {
                id: "12",
                name: "规格2",
              },
            ],
            k_s: "s1",
            count: 999,
          },
          {
            k: "重量",
            k_id: "2",
            v: [
              {
                id: "21",
                name: "",
              },
            ],
            k_s: "s2",
            count: 999,
          },
        ],
        list: [
          {
            id: 11,
            price: "", //价格
            discount: 122,
            s1: "11",
            s2: "21",
            stock_num: 999, //库存
            goods_id: "111",
          },
          {
            id: 12,
            price: "", //价格
            discount: 122,
            s1: "12",
            s2: "21",
            stock_num: 99, //库存
            goods_id: "112",
          },
        ],
        // 默认价格
        price: 0,
        // 商品总库存
        stock_num: 999,
        // 是否为无规格商品(false显示可供选择的标准 => 颜色和尺寸)
        none_sku: false,
        // 是否显示商品剩余库存(false显示库存 => 商品剩余多少件)
        hide_stock: false,
      },
      // 默认商品信息
      goods_info: {
        title: "",
        picture: "",
      },
      // 商品 id
      goods_id: "",
      // 默认选中的 sku
      initialSku: {
        s1: "11",
        s2: "21",
        selectedNum: 1, //下面的数字选择框的数字即买了多少件
      },

      // ================================

      isCollect: false,
      userAccount: "",
      collectGoodsId: {},

      skuList: {},
      skuText: [],
      skuLocal: {},
      shopcartCount: "",
    };
  },

  created() {
    // 截取路由查询参数
    this.goodsId = this.$route.query.goods_id;
    this.keywords = this.$route.query.keywords;
    // console.log('goodsId =>', this.goodsId);

    // 商品规格的商品 id
    this.goods_id = this.goodsId;

    // 获取用户账号
    this.userAccount = localStorage.getItem("userData");

    // 获取商品详情数据
    this.getGoodsDetail(this.goodsId);

    // 获取商品列表数据
    this.getGoodsListData();

    // 查询商品收藏状态
    this.queryCollect();

    // 从本地存储中获取购物车数据
    this.skuLocal = JSON.parse(localStorage.getItem("shopcartData"));
    // 显示购物车条数
    this.shopcartCount = Object.keys(this.skuLocal[this.userAccount]).length;
  },

  methods: {
    // 轮播效果
    onChange(index) {
      this.current = index;
    },

    // 点击 "立即购买" 按钮
    onBuyClicked(sku) {
      this.$toast("立即购买");
      console.log("buy-clicked => sku =>", sku);
    },

    // 加载提示
    toastLoad(time) {
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
      this.$router.back(0);
    },

    // 获取数组内的随机元素
    getRandomEle(arr, count) {
      let shuffled = arr.slice(0), //显示数组内的全部元素
        i = arr.length, //数组长度
        min = i - count, //从哪里开始截取元素
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },

    // 获取商品详情数据
    getGoodsDetail(goodsId) {
      // 开启加载提示
      this.toastLoad();

      // 调用 axios
      this.axios({
        method: "GET",
        url: "/goods/detail",
        params: {
          goods_id: goodsId,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // console.log("getGoodsDetail => res", res);

          // 判断
          if (res.data.meta.status == 200) {
            // 把商品详情数据放入数组内
            this.detailData = res.data.message;

            // 把轮播图数据放入数组中
            this.swipeData = this.detailData.pics;
            // console.log("detailData =>", this.detailData);

            // 把商品属性数据放入数组中
            this.attrsData = this.detailData.attrs;
            this.detailData.attrs.forEach((v) => {
              this.attrs += v.attr_name;
              this.attrs = this.attrs.concat("/");
            });
            this.attrs = this.attrs.substring(0, this.attrs.length - 1);
            // console.log("attrs =>", this.attrs);
            // console.log("attrsData =>", this.attrsData);

            // 渲染商品介绍图片数据
            this.introduceData = this.detailData.goods_introduce;

            // 把商品信息放入商品规格数组内
            if (this.detailData.goods_small_logo == "") {
              this.detailData.goods_small_logo = require("../assets/images/empty_goods.png");
            }
            this.sku.tree[0].v[0].imgUrl = this.detailData.goods_small_logo;

            if (this.detailData.goods_price == 0) {
              this.detailData.goods_price = 499;
            }
            this.sku.list[0].price = this.sku.list[1].price =
              this.detailData.goods_price * 100;

            this.sku.price = this.detailData.goods_price;

            this.goods_info = {
              title: this.detailData.goods_name,
              picture: this.detailData.goods_small_logo,
            };

            this.sku.list[0].goods = this.detailData.goods_price * 100;

            this.sku.tree[1].v[0].name = this.detailData.goods_weight;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getGoodsDetail => err", err);
        });
    },

    // 获取商品列表数据
    getGoodsListData() {
      // 开启加载提示
      this.toastLoad();
      // 调用 axios
      this.axios({
        method: "GET",
        url: "/goods/search",
        params: {
          query: this.keywords,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // console.log("getGoodsListData => res", res);

          // 判断
          if (res.data.meta.status == 200) {
            res.data.message.goods.forEach((v, i) => {
              // 删除当前商品的列表
              if (v.goods_id == this.goodsId) {
                res.data.message.goods.splice(i, 1);
              }
            });

            // 把该商品列表的数据放入数组内
            this.hotGoods = res.data.message.goods;
            this.tabGoods.forEach((v, i) => {
              if (this.hotGoods.length < 6) {
                v.goodsList = this.getRandomEle(
                  this.hotGoods,
                  this.hotGoods.length
                );
              } else {
                v.goodsList = this.getRandomEle(this.hotGoods, 6);
              }
            });
            // console.log("tabGoods =>", this.tabGoods);

            // 强制重新渲染页面
            this.$forceUpdate();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getGoodsListData => err", err);
        });
    },

    // 动态修改地址栏的路由参数
    changeQuery(index, i) {
      this.$router.push({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          goods_id: this.tabGoods[index].goodsList[i].goods_id,
        }),
      });
      // 获取商品列表搜索数据
      this.getGoodsDetail(this.tabGoods[index].goodsList[i].goods_id);

      // 重新刷新本页页面
      this.reload();
    },

    // 商品收藏状态
    goodsCollect() {
      // 收藏状态切换
      this.isCollect = !this.isCollect;

      // 将收藏商品存入收藏数组内
      let collectData = JSON.parse(localStorage.getItem("collectData"));

      // 处于收藏状态的商品
      if (this.isCollect) {
        collectData[this.userAccount][this.goodsId] = Object.assign({
          goods_id: this.goodsId,
          keywords: this.keywords,
          goods_name: this.detailData.goods_name,
          goods_price: this.detailData.goods_price,
          goods_img: this.detailData.goods_small_logo,
          goods_weight: this.detailData.goods_weight,
        });

        // 开启加载提示
        this.$toast.success("收藏成功");
      } else if (!this.isCollect) {
        // 处于非收藏状态的商品
        delete collectData[this.userAccount][this.goodsId];

        // 开启加载提示
        this.$toast.success("取消成功");
      }

      // console.log("collectData =>", collectData);

      // 将收藏数据放入本地存储中
      localStorage.setItem("collectData", JSON.stringify(collectData));
    },

    // 查询商品收藏状态
    queryCollect() {
      // 获取本地存储中收藏商品的商品 id
      this.collectGoodsId = JSON.parse(localStorage.getItem("collectData"))[
        this.userAccount
      ];

      // 根据商品 id的存在决定商品收藏的状态
      for (let key in this.collectGoodsId) {
        if (this.goodsId == key) {
          this.isCollect = true;
        }
      }
    },

    // 加入购物车
    addShopcart() {
      // 获取选中的商品规格和重量
      let skuData = this.$refs.getSku.getSkuData();

      for (let i = 0; i < this.sku.tree.length; i++) {
        for (let key in skuData.selectedSkuComb) {
          if (key == this.sku.tree[i].k_s || key == this.sku.tree[i].k_s) {
            for (let j = 0; j < this.sku.tree[i].v.length; j++) {
              if (skuData.selectedSkuComb[key] == this.sku.tree[i].v[j].id) {
                // console.log(this.sku.tree[i].v[j].name);
                this.skuText.push({
                  [this.sku.tree[i].k_s]: this.sku.tree[i].v[j].name,
                });
              }
            }
          }
        }
      }
      // console.log(this.skuText)

      // 商品规格数据
      this.skuList = {
        goods_id: skuData.goodsId,
        goods_num: skuData.selectedNum,
        goods_price: skuData.selectedSkuComb.price / 100,
        goods_sku: this.skuText[0].s1,
        goods_weight: this.skuText[1].s2,
        keywords: this.keywords,
      };
      // console.log(this.skuList);

      // 从本地存储中获取购物车数据
      this.skuLocal = JSON.parse(localStorage.getItem("shopcartData"));

      // 重新创建一份新的购物车数据
      this.skuLocal[this.userAccount][skuData.goodsId] = Object.assign(
        this.skuList
      );
      // console.log(skuLocal);

      // 将新的购物车数据放入本地存储中
      localStorage.setItem("shopcartData", JSON.stringify(this.skuLocal));

      // 显示购物车条数
      this.shopcartCount = Object.keys(this.skuLocal[this.userAccount]).length;

      // 开启轻提示
      this.$toast.success("加入购物车成功");
    },
  },
};
</script>
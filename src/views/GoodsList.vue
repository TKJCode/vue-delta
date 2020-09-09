<template>
  <div class="goodsList">
    <!-- 顶部搜索栏 -->
    <div class="top-search">
      <van-row>
        <van-col span="3">
          <van-icon size=".55rem" name="arrow-left" color="#f2373b" @click="goBack" />
        </van-col>
        <van-col span="18">
          <van-search
            shape="round"
            v-model="keywords"
            placeholder="DELTA SuperMall"
            @search="changeQuery"
          />
        </van-col>
        <van-col span="3" class="change-col" @click="toggleSpan">
          <img
            class="auto-img change-img"
            v-if="isSpan"
            src="../assets/images/goodsList_span_1.png"
            alt
          />
          <img
            class="auto-img change-img"
            v-if="!isSpan"
            src="../assets/images/goodsList_span_2.png"
            alt
          />
        </van-col>
      </van-row>
    </div>

    <!-- 轮播栏 -->
    <div class="goodsList-slide">
      <div class="slide-list clearfix" :style="{width: (goodsListData.length * 75) + 10 + 'px'}">
        <div class="slide-item fl" v-for="(item, index) in goodsListData" :key="index">
          <div class="slide-img">
            <img
              class="auto-img"
              v-if="item.goods_small_logo == ''"
              :src="require('../assets/images/empty_goods.png')"
              alt
            />
            <img class="auto-img" v-else v-lazy="item.goods_small_logo" alt />
          </div>
          <div class="slide-text one-text">{{item.goods_name}}</div>
        </div>
      </div>
    </div>

    <!-- 选择条 -->
    <div class="goodsList-select">
      <div class="select-list clearfix">
        <div
          class="select-item clearfix fl"
          v-for="(item, index) in selectData"
          :key="index"
          @click="toggleSelect(item)"
        >
          <span class="select-text fl" :class="{'active': item.isActive}">{{item.title}}</span>
          <span class="select-icon fl" v-if="!item.isFilter">
            <img class="auto-img" :src="item.isActive == true ? item.iconActive : item.icon" alt />
          </span>
          <span class="select-icon fl" v-if="item.isFilter">
            <img class="auto-img filter-img" :src="item.icon" alt />
          </span>
        </div>
      </div>
    </div>

    <!-- 商品栏 span-1形态 -->
    <div class="hot-products" v-if="isSpan">
      <div
        class="products-item clearfix"
        v-for="(item, index) in goodsListData"
        :key="index"
        @click="goDetail(index)"
      >
        <!-- 左边图片框 -->
        <div class="item-left fl">
          <img
            class="auto-img left-img"
            v-if="item.goods_small_logo == ''"
            :src="require('../assets/images/empty_goods.png')"
            alt
          />
          <img class="auto-img left-img" v-else v-lazy="item.goods_small_logo" alt />
        </div>

        <!-- 右边文字框 -->
        <div class="item-right fl">
          <!-- 标题栏 -->
          <div class="item-title">
            <span>{{item.goods_name}}</span>
          </div>

          <!-- 价格栏 -->
          <div class="item-right-bottom">
            <div class="item-price clearfix">
              <div class="price-symbol fl">￥</div>
              <div class="price-big fl" v-if="item.goods_price == '0'">499</div>
              <div class="price-big fl" v-else>{{item.goods_price}}</div>
              <div class="price-small fl">.00</div>
            </div>
            <div class="item-rec">
              <!-- 评论数和好评率 -->
              <div class="rec-com">
                <span class="self-icon">
                  <img
                    class="auto-img self-img"
                    :src="require('../assets/images/icon_self_support.png')"
                    alt
                  />
                </span>
                <span class="comment-num">{{item.comm}}万条评论</span>
                <span class="praise-rate">{{item.goodsComm}}%好评率</span>
              </div>

              <!-- 旗舰店 -->
              <div class="rec-store">
                <span class="store-text">乐享商城自营</span>
                <span class="store-icon">
                  <van-icon name="arrow" color="#999" size="mini" />
                </span>
              </div>

              <div class="item-more fl">
                <img class="auto-img" :src="require('../assets/images/hot_more.png')" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品栏 span-2形态 -->
    <div class="change-products clearfix" v-if="!isSpan">
      <div class="change-item fl" v-for="(item, index) in goodsListData" :key="index">
        <!-- 顶部图片栏 -->
        <div class="change-top">
          <img
            class="auto-img"
            v-if="item.goods_small_logo == ''"
            :src="require('../assets/images/empty_goods.png')"
            alt
          />
          <img class="auto-img" v-else v-lazy="item.goods_small_logo" alt />
        </div>

        <div class="change-text">
          <!-- 标题栏 -->
          <div class="change-title">{{item.goods_name}}</div>

          <!-- 底部信息栏 -->
          <div class="change-bottom">
            <!-- 价格 -->
            <div class="item-price clearfix">
              <div class="price-symbol fl">￥</div>
              <div class="price-big fl" v-if="item.goods_price == '0'">499</div>
              <div class="price-big fl" v-else>{{item.goods_price}}</div>
              <div class="price-small fl">.00</div>
            </div>
            <!-- 评价 -->
            <div class="item-rec">
              <!-- 评论数和好评率 -->
              <div class="rec-com">
                <span class="self-icon">
                  <img
                    class="auto-img self-img"
                    :src="require('../assets/images/icon_self_support.png')"
                    alt
                  />
                </span>
                <span class="comment-num">{{item.comm}}万条评论</span>
              </div>

              <!-- 旗舰店 -->
              <div class="rec-store">
                <span class="store-text">乐享商城自营</span>
                <span class="store-icon">
                  <van-icon name="arrow" color="#999" size="mini" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入样式
import "../assets/css/goodsList.less";

export default {
  name: "GoodsList",
  data() {
    return {
      selectData: [
        {
          title: "综合",
          iconActive: require("../assets/images/goodsList_active_down.png"),
          icon: require("../assets/images/goodsList_down.png"),
          isActive: true,
          isFilter: false,
        },
        {
          title: "销量",
          iconActive: "",
          icon: "",
          isActive: false,
          isFilter: false,
        },
        {
          title: "有货",
          iconActive: require("../assets/images/goodsList_active_down.png"),
          icon: require("../assets/images/goodsList_down.png"),
          isActive: false,
          isFilter: false,
        },
        {
          title: "筛选",
          iconActive: require("../assets/images/goodsList_filter.png"),
          icon: require("../assets/images/goodsList_filter.png"),
          isActive: false,
          isFilter: true,
        },
      ],
      keywords: "", //查询关键词

      // 商品列表数据
      goodsListData: [],

      // 随机数对象
      randomObj: {
        comm: 0,
        goodComm: 0,
      },

      // 商品栏形态
      isSpan: true,
    };
  },

  created() {
    // 截取路由查询参数
    this.keywords = this.$route.query.keywords;
    console.log("keywords =>", this.keywords);

    // 获取商品列表搜索数据
    this.getGoodsInfo();
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

    // 跳转页面
    goBack() {
      this.$router.go(-1);
    },

    // 获取随机数
    getRandomNum(start, end, fixed) {
      let differ = end - start;
      let random = Math.random();
      return (start + differ * random).toFixed(fixed);
    },

    // 点击切换 select-item
    toggleSelect(item) {
      if (item.isActive) {
        return;
      }
      for (let i = 0; i < this.selectData.length; i++) {
        if (this.selectData[i].isActive) {
          this.selectData[i].isActive = false;
        }
      }
      item.isActive = true;
    },

    // 点击切换商品栏状态
    toggleSpan() {
      this.isSpan = !this.isSpan;
    },

    // 获取商品列表搜索数据
    getGoodsInfo() {
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
          console.log("getGoodsInfo => res", res);

          // 判断
          if (res.data.meta.status == 200) {
            // 遍历数据
            res.data.message.goods.forEach((v) => {
              // 获取随机数
              let comm = this.getRandomNum(1, 10, 1);
              let goodsComm = this.getRandomNum(80, 100, 0);

              // 添加属性
              (v.comm = comm), (v.goodsComm = goodsComm);
            });

            // 把商品列表数据放入数组内
            this.goodsListData = res.data.message.goods;
            console.log("goodsListData =>", this.goodsListData);
          } else {
            this.$toast.fail(res.data.meta.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getGoodsInfo => err", err);
        });
    },

    // 动态修改地址栏的路由参数
    changeQuery() {
      this.$router.push({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, {
          keywords: this.keywords,
        }),
      });
      // 获取商品列表搜索数据
      this.getGoodsInfo();
    },

    // 携带商品 id路由参数跳转商品详情页面
    goDetail(index) {
      // 跳转路由
      this.$router.push({
        name: "Detail",
        query: {
          keywords: this.keywords,
          goods_id: this.goodsListData[index].goods_id
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="hot">
    <!-- 顶部搜索栏 -->
    <div class="top-search">
      <van-search
        shape="round"
        background="#f2373b"
        placeholder="DELTA SuperMall"
        clearable
        @click="goPage('Search')"
      />
    </div>

    <!-- 顶部 Tab栏 -->
    <!-- 标题栏 -->
    <div class="hot-title clearfix">
      <div
        class="title-nav fl"
        v-for="(item, index) in navData"
        :key="index"
        @click="toggleNav(item)"
      >
        <div class="big-title" :class="{'big-active': item.isActive}">{{item.bigTitle}}</div>
        <div class="small-title" :class="{'small-active': item.isActive}">{{item.smallTitle}}</div>
      </div>
      <div class="line"></div>
    </div>

    <!-- 商品栏 -->
    <div class="hot-products" v-for="(item, index) in goodsList" :key="index">
      <div
        class="products-item clearfix"
        v-for="(v, i) in item.goods"
        :key="i"
        @click="goDetail(index, i)"
      >
        <!-- 左边图片框 -->
        <div class="item-left fl">
          <img
            class="auto-img left-img"
            v-if="v.goods_small_logo == ''"
            :src="require('../../assets/images/empty_goods.png')"
            alt
          />
          <img v-else class="auto-img left-img" v-lazy="v.goods_small_logo" alt />
        </div>

        <!-- 右边文字框 -->
        <div class="item-right fl">
          <!-- 标题栏 -->
          <div class="item-title">
            <!-- 百亿补贴 tag -->
            <span v-if="v.isSubsidyIcon">
              <img
                class="auto-img subsidy-img"
                :src="require('../../assets/images/hot_icons_07.png')"
                alt
              />
            </span>
            <span
              class="title-text"
              :style="{paddingLeft: v.isSubsidyIcon ? '48px' : '0'}"
            >{{v.goods_name}}</span>
          </div>

          <!-- tag栏 -->
          <div class="item-icons clearfix one-text">
            <!-- 最低价 tag -->
            <div class="lower-price-tag fl clearfix" v-if="v.isLower">
              <div class="lower-price-icon fl">
                <img class="auto-img" :src="require('../../assets/images/hot_icons_02.png')" alt />
              </div>
              <div class="lower-price-text fl">{{v.dayLower}}天最低价</div>
            </div>
            <!-- 直播中 tag -->
            <div class="living-tag fl" v-if="v.isLiving">
              <div class="living-bg"></div>
              <div class="living-user">
                <img
                  class="auto-img user-img"
                  :src="require('../../assets/images/user_head.jpg')"
                  alt
                />
              </div>
              <span class="living-icon clearfix">
                <img
                  class="auto-img living-img fl"
                  :src="require('../../assets/images/hot_living.gif')"
                  alt
                />
                <span class="living-text fl">直播中</span>
              </span>
            </div>
            <!-- 探厂视频 tag -->
            <div class="video-tag fl" v-if="v.isVideo">
              <img class="auto-img" :src="require('../../assets/images/hot_icons_06.png')" alt />
            </div>
            <!-- 排行榜 tag -->
            <div class="rank-tag fl" v-if="v.isRank">
              <span class="rank-icon">
                <img
                  class="auto-img rank-img"
                  :src="require('../../assets/images/hot_icons_03.png')"
                  alt
                />
              </span>
              <span class="rank-text">{{v.textRank}}</span>
            </div>
          </div>

          <!-- 价格栏 -->
          <div class="item-right-bottom">
            <div class="item-price clearfix">
              <!-- 补贴价 tag -->
              <div class="price-subsidy fl" v-if="v.isSubsidy">补贴价</div>

              <div class="price-symbol fl">￥</div>
              <div v-if="v.goods_price == 0" class="price-big fl">499</div>
              <div v-else class="price-big fl">{{v.goods_price}}</div>
              <div class="price-small fl">.00</div>

              <!-- 优惠券 tag -->
              <div class="price-coupon fl" v-if="v.isCoupon">
                <span class="coupon">
                  <img
                    class="auto-img coupon-img"
                    :src="require('../../assets/images/hot_coupon.png')"
                    alt
                  />
                </span>
                <span class="coupon-text">{{v.textCoupon}}</span>
              </div>
            </div>
            <div class="item-rec">
              <div v-if="v.isPriceBottom">
                <!-- 工厂直供 tag -->
                <div class="factory-tag fl">
                  <img class="auto-img" :src="require('../../assets/images/hot_icons_05.png')" alt />
                </div>
                <!-- 拼团 -->
                <div class="rec-group fl">{{v.groupNum}}人拼</div>
                <div class="rec-grouped fl">{{v.groupedNum}}万人已拼</div>
              </div>

              <div class="rec-com" v-if="v.isCom">
                <!-- 评论数和好评率 -->
                <span class="comment-num">{{v.numCom}}万条评论</span>
                <span class="praise-rate">{{v.rateCom}}%好评率</span>
              </div>

              <div class="item-more fl">
                <img class="auto-img" :src="require('../../assets/images/hot_more.png')" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入样式
import "../../assets/css/mainCss/hot.less";

export default {
  name: "Hot",
  data() {
    return {
      navData: [
        {
          bigTitle: "今日推荐",
          smallTitle: "爆款热卖",
          isActive: true,
        },
        {
          bigTitle: "乐享商城",
          smallTitle: "自营优选",
          isActive: false,
        },
      ],
      keywords: [],
      keywordsData: [],
      goodsData: [],
      goodsList: [],
    };
  },

  created() {
    // 获取商品数据
    this.getGoods();
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

    // 获取随机数
    getRandomNum(start, end, fixed) {
      let differ = end - start;
      let random = Math.random();
      return (start + differ * random).toFixed(fixed);
    },

    // 获取商品数据
    getGoods() {
      // 从本地储存中获取关键词数据
      this.keywords = this.getRandomEle(
        localStorage.getItem("keywords").split(","),
        10
      );

      // 生成关键词数据
      this.keywords.forEach((v, i) => {
        this.keywordsData.push({ keywords: v, index: i });
      });

      // 遍历关键词数据 获取商品数据
      for (let i = 0; i < this.keywordsData.length; i++) {
        this.getGoodsList(i);
      }
    },

    // 切换顶部导航栏 nav
    toggleNav(item) {
      if (item.isActive) {
        return;
      }

      for (let i = 0; i < this.navData.length; i++) {
        if (this.navData[i].isActive) {
          this.navData[i].isActive = false;
        }
      }

      item.isActive = true;

      // 清空数据
      this.keywords = [];
      this.keywordsData = [];
      this.goodsData = [];
      this.goodsList = [];

      // 重新获取商品数据
      this.getGoods();
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

    // 获取商品列表
    getGoodsList(index) {
      // 开启加载提示
      this.toastLoad();

      // 调用 axios
      this.axios({
        method: "GET",
        url: "/goods/search",
        params: {
          query: this.keywordsData[index].keywords,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // console.log("getGoodsList => res =>", res);

          // 判断
          if (res.data.meta.status == 200) {
            this.goodsData = res.data.message.goods;

            // 随机抽取两条商品数据
            this.goodsData = this.getRandomEle(this.goodsData, 2);

            // 如果数据不存在则删除该数据
            if (this.goodsData[0] == undefined) {
              this.goodsData.splice(this.goodsData[0], 1);
            }

            this.goodsData.forEach((v, i) => {
              if (i / 2 == 0) {
                // 最低价 tag
                v.isLower = true;
                v.dayLower = this.getRandomNum(10, 99, 0);
                // 拼团 tag
                v.isPriceBottom = true;
                v.groupNum = this.getRandomNum(2, 4, 0);
                v.groupedNum = this.getRandomNum(1, 10, 1);
                //排行榜 tag
                v.isRank = true;
                v.textRank =
                  this.keywordsData[index].keywords +
                  "热销榜第" +
                  this.getRandomNum(1, 5, 0) +
                  "名";
                // 优惠券 tag
                v.isCoupon = true;
                v.textCoupon =
                  "满" + v.goods_price * 2 + "减" + this.getRandomNum(5, 20, 0);
              } else {
                v.isSubsidyIcon = true; //百亿补贴 tag
                v.isSubsidy = true; //补贴价 tag
                v.isLiving = true; //直播中 tag
                v.isVideo = true; // 探厂视频 tag
                v.isCom = true;
                v.numCom = this.getRandomNum(1, 10, 1);
                v.rateCom = this.getRandomNum(80, 100, 0);
              }
            });

            // 将商品数据和商品关键词放入数组内
            this.goodsList.push({
              goods: this.goodsData,
              keywords: this.keywordsData[index].keywords,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getGoodsList => err =>", err);
        });
    },

    // 点击跳转到商品详情页面
    goDetail(index, i) {
      this.$router.push({
        name: "Detail",
        query: {
          keywords: this.goodsList[index].keywords,
          goods_id: this.goodsList[index].goods[i].goods_id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="search">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <van-row class="vanRow">
        <van-col span="4" class="vanCol-icon">
          <van-icon size=".55rem" name="arrow-left" color="#f2373b" @click="goBack" />
        </van-col>
        <van-col span="16">
          <van-search v-model="search" show-action label="DTS" placeholder="DELTA SuperMall" @search="goGoodsList(search)" />
        </van-col>
        <van-col span="4" class="vanCol-text" @click="goGoodsList(search)">搜索</van-col>
      </van-row>
    </div>

    <!-- 搜索栏 -->
    <div class="search-box">
      <div class="search-title">
        <div class="search-hot fl">热门搜索</div>
        <div class="title-right fr clearfix">
          <div class="search-hide fl" @click="toggleShow">隐藏</div>
          <div class="search-change fl" @click="clickChange">换一批</div>
        </div>
      </div>
      <div class="search-list clearfix" v-if="isShow">
        <div class="search-item fl" v-for="(item, index) in nameArr" :key="index" @click="goGoodsList(item)">
          <span class="search-icon" v-if="index == 0 || index == 1">
            <img class="auto-img" :src="require('../assets/images/search_hot.png')" alt />
          </span>
          <span class="search-text">{{item}}</span>
        </div>
      </div>
      <div class="search-empty" v-if="!isShow">已隐藏搜索发现</div>
    </div>
  </div>
</template>

<script>
// 导入样式
import "../assets/css/search.less";

export default {
  name: "Search",

  data() {
    return {
      search: '',
      goodsData: [],
      index: 0,
      indexArr: [],
      nameArr: [],
      isShow: true,
    };
  },

  created() {
    // 获取商品分类数据
    this.getGoodsTypeData();

    console.log("goodsData =>", this.goodsData);
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

    // 点击切换隐藏/显示
    toggleShow() {
      this.isShow = !this.isShow;
    },

    // 点击换一批
    clickChange() {
      // 清空数组
      this.indexArr = [];
      this.nameArr = [];

      // 重新遍历生成数组
      while (this.indexArr.length <= 15) {
        this.index = this.getRandomNum(0, this.goodsData.length - 1, 0);

        if (this.indexArr.indexOf(this.index) == -1) {
          this.indexArr.push(this.index);
        }
      }

      this.indexArr.forEach((v) => {
        this.nameArr.push(this.goodsData[v]);
      });
    },

    // 获取商品分类数据
    getGoodsTypeData() {
      // 开启加载提示
      this.toastLoad();

      // 调用 axios
      this.axios({
        method: "GET",
        url: "/categories",
      })
        .then((res) => {
          this.$toast.clear();
          console.log("getGoodsTypeData => res", res);

          // 判断
          if (res.data.meta.status == 200) {
            // 遍历数据
            res.data.message.forEach((v) => {
              v.children.forEach((val) => {
                if (val.children) {
                  val.children.forEach((value) => {
                    this.goodsData.push(value.cat_name);
                  });
                }
              });
            });
            console.log('goodsData =>', this.goodsData);
            localStorage.setItem('keywords', this.goodsData);

            while (this.indexArr.length <= 15) {
              this.index = this.getRandomNum(0, this.goodsData.length - 1, 0);

              if (this.indexArr.indexOf(this.index) == -1) {
                this.indexArr.push(this.index);
              }
            }

            this.indexArr.forEach(v => {
              this.nameArr.push(this.goodsData[v]);
            });

            // console.log("nameArr =>", this.nameArr);
            // console.log(this.goodsData[this.index]);
            // console.log('goodsData =>', this.goodsData);
            // console.log('index =>', this.index);
            // console.log('name =>', this.goodsData[this.index])
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getGoodsTypeData => err", err);
        });
    },

    // 点击分类商品获取 cat_id和 cat_name
    // 路由跳转到商品列表页面
    goGoodsList(item) {
      // 搜索关键词
      let keywords = item;

      // 路由跳转
      this.$router.push({ name: "GoodsList", query: { keywords } });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
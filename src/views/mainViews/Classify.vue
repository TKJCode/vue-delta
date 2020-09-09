<template>
  <div class="classify">
    <!-- 顶部搜索栏 -->
    <div class="top-search">
      <van-row>
        <van-col span="3">
          <van-icon size=".55rem" name="arrow-left" color="#f2373b" @click="goBack" />
        </van-col>
        <van-col span="18">
          <van-search shape="round" v-model="value" placeholder="DELTA SuperMall" @focus="goPage('Search')" />
        </van-col>
        <van-col span="3">
          <van-icon name="ellipsis" color="#5E606B" size=".7rem" @click="showItems" />
        </van-col>
      </van-row>
    </div>

    <!-- 跳转选项栏 -->
    <div class="my-section" v-show="isShow">
      <SkipSection></SkipSection>
    </div>

    <!-- 左右侧栏 -->
    <div class="classify-content">
      <!-- 左侧导航栏 -->
      <div class="left-nav fl">
        <div
          class="nav-item"
          :class="{'active': item.isActive}"
          v-for="(item, index) in typeData"
          :key="index"
          @click="toggleNavItem(item, index)"
        >{{item.cat_name}}</div>
      </div>

      <!-- 右侧商品栏 -->
      <div class="right-content fl clearfix">
        <!-- 标题栏 -->
        <div class="content-title fl clearfix">
          <div class="title-left fl">热门分类</div>
          <div class="title-right fr clearfix">
            <div class="right-icon fl">
              <img class="auto-img rank-icon" src="../../assets/images/rank.png" alt />
            </div>
            <div class="right-text fl">
              排行榜
              <van-icon name="arrow" />
            </div>
          </div>
        </div>

        <!-- 商品栏 -->
        <div class="content-goods fl">
          <!-- 二级分类 -->
          <div
            class="content-two clearfix"
            v-for="(item, index) in goodsTwoData[navIndex]"
            :key="index"
          >
            <!-- 二级标题 -->
            <div class="two-title">{{item.cat_name}}</div>
            <!-- 二级商品 -->
            <div
              class="goods-item fl"
              v-for="(v, i) in item.children"
              :key="i"
              @click="goGoodsList(v, i)"
            >
              <!-- 商品图片 -->
              <div class="item-img">
                <img class="auto-img goods-img" v-lazy="v.cat_icon" alt />
              </div>
              <!-- 商品名称 -->
              <div class="item-name one-text">{{v.cat_name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入样式
import "../../assets/css/mainCss/classify.less";

export default {
  name: "Classify",

  data() {
    return {
      isShow: false,
      value: "",
      navIndex: 0,
      typeData: [],
      goodsTwoData: [],
    };
  },

  created() {
    // 获取商品类型数据
    this.getGoodsType();
  },

  methods: {
    // 加载提示
    toastLoad() {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示(如果值为 0,则不会自动关闭)
        duration: 0
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

    // 展示跳转选项
    showItems() {
      this.isShow = !this.isShow;
    },

    // 切换左侧导航栏数据
    toggleNavItem(item, index) {
      this.navIndex = index;
      if (item.isActive) {
        return;
      }
      for (let i = 0; i < this.typeData.length; i++) {
        if (this.typeData[i].isActive) {
          this.typeData[i].isActive = false;
          break;
        }
      }
      item.isActive = true;
    },

    // 获取商品类型数据
    getGoodsType() {
      // 开启加载提示
      this.toastLoad();

      // 调用 axios
      this.axios({
        method: "GET",
        url: "/categories"
      })
        .then(res => {
          this.$toast.clear();
          console.log("getGoodsType => res", res);

          // 判断
          if (res.data.meta.status == 200) {
            // 去除特殊字段的数组元素
            if (res.data.message.indexOf("苏宁") == -1) {
              res.data.message.splice(3, 1);
            }

            // 数组元素位置互换(热门推荐置顶)
            res.data.message.unshift(res.data.message.splice(1, 1)[0]);

            // 添加 isActive属性
            res.data.message.forEach((v, i) => {
              v.isActive = false;
              v.index = i;
            });

            // 赋值
            this.navIndex = res.data.message.index;
            this.typeData = res.data.message;

            // 设置第一项  "热门推荐" isActive为 true
            this.typeData[0].isActive = true;

            // 删除数据中的无用元素
            this.typeData[this.typeData.length - 1].children.splice(
              0,
              this.typeData[this.typeData.length - 1].children.length - 1
            );
            this.typeData[0].children.splice(1, 1);
            console.log("typeData =>", this.typeData);

            // 将 children属性推入商品数据 goodsData内
            res.data.message.forEach(v => {
              this.goodsTwoData.push(v.children);

              // v.children.forEach((val, ind) => {
              //   this.goodsThirdData.push({ thirdData: val.children });
              //   console.log('val =>', val)

              //   val.children.forEach((v1, i1) => {
              //     console.log('v1 =>', v1)
              //     console.log('v1.cat_name =>', v1.cat_name)
              //   })
              // });
            });

            // 初始化页面默认数据
            this.navIndex = 0;

            console.log("goodsTwoData =>", this.goodsTwoData);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("getGoodsType => err", err);
        });
    },

    // 点击分类商品获取 cat_id和 cat_name
    // 路由跳转到商品列表页面
    goGoodsList(item, index) {
      // 搜索关键词
      let keywords = item.cat_name;

      // 路由跳转
      this.$router.push({ name: "GoodsList", query: { keywords } });
    }
  }
};
</script>
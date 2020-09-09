<template>
  <div class="myCollect" :style="{bottom: isEditShow ? '50px' : '0'}">
    <!-- 顶部标题栏 -->
    <div class="top-title">
      <van-nav-bar title="我的收藏" left-arrow :fixed="true" @click-left="goBack">
        <template #right>
          <van-icon name="ellipsis" color="#5E606B" size=".7rem" @click="showItems" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 跳转选项栏 -->
    <div class="my-section" v-show="isShow">
      <SkipSection></SkipSection>
    </div>

    <!-- 编辑栏 -->
    <div class="collect-edit clearfix">
      <span class="edit-num fl">
        <span>共</span>
        <span class="num-ch">{{collectNum}}</span>
        <span>件商品</span>
      </span>
      <span class="edit-text fr" @click="clickEdit">{{isEditShow ? '完成' : '编辑'}}</span>
    </div>

    <!-- 收藏商品栏 -->
    <div class="collect-goods" ref="collectGoods">
      <van-list
        v-model="loadOptions.isLoading"
        :finished="loadOptions.isFinished"
        :finished-text="loadOptions.finishedText"
        @load="loadData"
      >
        <div class="goods-item clearfix" v-for="(item, index) in collectData[0]" :key="index">
          <div class="goods-checked fl" :style="{left: isEditShow ? '0' : '-1.17333rem'}">
            <van-checkbox v-model="item.isCheck" @click="checkedGoodsOne"></van-checkbox>
          </div>
          <div class="goods-left fl" :style="{left: isEditShow ? '1.17333rem' : '0.26667rem'}" @click="goDetail(index)">
            <img class="auto-img" v-lazy="item.goods_img" alt />
          </div>
          <div class="goods-right fl" :style="{left: isEditShow ? '4.10667rem' : '3.2rem'}" @click="goDetail(index)">
            <div class="right-title two-text">{{item.goods_name}}</div>
            <div class="right-sku one-text">
              <span>规格：</span>
              <span>规格1</span>，
              <span>重量：</span>
              <span>{{item.goods_weight}}</span>
            </div>
            <div class="right-price">
              <span class="price-sm">￥</span>
              <span class="price-big">{{item.goods_price}}</span>
              <span class="price-sm">.00</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <!-- 底部全选栏 -->
    <div class="collect-bottom" v-show="isEditShow">
      <van-submit-bar button-text="取消收藏" @submit="cancelCollect">
        <template #default>
          <van-checkbox v-model="checkedAll" @click="checkedGoodsAll">全选</van-checkbox>
        </template>
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
// 引入样式
import "../assets/css/myCollect.less";

export default {
  name: "MyCollect",
  data() {
    return {
      isShow: false,
      collectData: [],
      collectList: [],
      collectGoods: [],
      userAccount: "",
      collectNum: "",
      listNum: "",

      checkedOne: false,
      checkedAll: false,
      isEditShow: false,

      // 商品列表懒加载
      loadOptions: {
        isLoading: true, //是否处于加载状态，加载过程中不触发 load事件
        isFinished: false, //是否已经完成加载所有数据
        finishedText: "无数据可加载...",
      },

      // 每次懒加载 8条数据
      loadCount: 8,
    };
  },
  created() {
    // 获取用户账号
    this.userAccount = localStorage.getItem("userData");

    // 获取商品收藏数据
    this.getCollect();
  },
  methods: {
    // 加载提示
    toastLoad() {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示(如果值为 0,则不会自动关闭)
        duration: 200,
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

    // 获取商品收藏数据
    getCollect() {
      // 开启加载提示
      this.toastLoad();

      this.collectData.push(
        JSON.parse(localStorage.getItem("collectData"))[this.userAccount]
      );

      // 获取收藏商品的个数
      this.collectNum = Object.keys(this.collectData[0]).length;

      // 循环对象添加 isCheck
      for (let key in this.collectData[0]) {
        this.collectData[0][key] = Object.assign(
          {
            isCheck: false,
          },
          this.collectData[0][key]
        );
      }

      // 收藏列表的所有商品
      this.collectGoods = Object.values(this.collectData[0]);
      // console.log("collectGoods =>", this.collectGoods);

      // 懒加载商品列表
      // 给总的商品数据中的前 8个商品进行懒加载
      // 后面的商品只有往下翻阅才会进行加载
      this.collectList = this.collectGoods.splice(0, this.loadCount);
      // console.log("collectList =>", this.collectList);

      // 根据截取购物车商品数量和购物车总的商品数量判断是否加载完成
      if (this.collectGoods.length > 0) {
        this.loadOptions.isLoading = false;
      } else {
        // 无数据可加载
        this.loadOptions.isLoading = true;
        this.loadOptions.isFinished = true;
      }

      // 当购物车的商品数据为 0时,提示文字为空
      if (this.collectList.length == 0) {
        this.loadOptions.finishedText = "";
      }
      
      this.$forceUpdate();
    },

    // 点击编辑选项
    clickEdit() {
      this.isEditShow = !this.isEditShow;
    },

    // 商品列表懒加载
    loadData() {
      setTimeout(() => {
        // 定时加载
        this.collectList.push(...this.collectGoods.splice(0, this.loadCount));

        // 如果购物车总的商品数据为 0时
        if (this.collectGoods.length == 0) {
          // 无数据可加载
          this.loadOptions.isLoading = true;
          this.loadOptions.isFinished = true;
        }
      }, 500);
    },

    // 全选
    checkedGoodsAll() {
      // 遍历商品数据,根据 ischeck属性判定是否全选
      for (let key in this.collectData[0]) {
        this.collectData[0][key].isCheck = this.checkedAll;
      }
    },

    // 单选
    checkedGoodsOne() {
      // 每次调用前先把所有的单选按钮取消选择状态
      this.checkedOne = false;

      // 判断
      // 当所有单选按钮都为选中状态时
      for (let key in this.collectData[0]) {
        if (this.collectData[0][key].isCheck) {
          this.checkedAll = true;
          break;
        }
      }

      // 当至少有一个单选按钮不是选中状态时
      for (let key in this.collectData[0]) {
        if (!this.collectData[0][key].isCheck) {
          this.checkedAll = false;
          return;
        }
      }
    },

    // 取消收藏
    cancelCollect() {
      for (let key in this.collectData[0]) {
        if (this.collectData[0][key].isCheck) {
          // 删除对象中对应的 key
          delete this.collectData[0][key];
        }
      }

      let collectLocal = {
        [this.userAccount]: { ...this.collectData[0] },
      };
      this.collectNum = Object.keys(collectLocal[this.userAccount]).length;

      // 将收藏数据放入本地存储中
      localStorage.setItem("collectData", JSON.stringify(collectLocal));

      this.$forceUpdate();
    },

    // 跳转到商品详情页面
    goDetail(index) {
      this.$router.push({
        name: 'Detail',
        query: {
          keywords: this.collectData[0][index].keywords,
          goods_id: this.collectData[0][index].goods_id
        }
      })

    }
  },
};
</script>

<style lang="less" scoped>
</style>
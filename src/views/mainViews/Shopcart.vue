<template>
  <div class="shopcart">
    <!-- 顶部标题栏 -->
    <div class="top-title">
      <van-nav-bar title="购物车" left-arrow :fixed="true" @click-left="goBack">
        <template #right>
          <van-icon name="ellipsis" color="#5E606B" size=".7rem" @click="showItems" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 跳转选项栏 -->
    <div class="my-section" v-show="isShow">
      <SkipSection></SkipSection>
    </div>

    <!-- 地址栏和编辑栏 -->
    <div class="address-edit clearfix">
      <div class="address fl clearfix" v-show="!isEdit">
        <span class="address-icon">
          <van-icon class="fl" name="location-o" />
        </span>
        <span class="address-text fl">朝阳区三环到四环之间</span>
      </div>
      <div class="line fl" v-show="!isEdit"></div>
      <div class="edit fr" @click="clickEdit">
        <span class="edit-text">{{isEdit ? '完成' : '编辑商品'}}</span>
      </div>
    </div>

    <!-- 商品列表栏 -->
    <div class="goods-list">
      <!-- 商品 -->
      <div class="list-item clearfix" v-for="(item, index) in shopcartData" :key="index">
        <van-swipe-cell>
          <!-- 左侧单选框 -->
          <div class="item-checkbox fl">
            <van-checkbox v-model="item.isCheck" checked-color="#f2373b" @click="checkedGoodsOne"></van-checkbox>
          </div>

          <!-- 右侧商品信息框 -->
          <div class="item-info fl clearfix">
            <!-- 左侧图片框 -->
            <div class="info-img fl" @click="goDetail(index)">
              <img class="auto-img" v-lazy="item.goods_img" alt />
            </div>

            <!-- 右侧文字框 -->
            <div class="info-text fl">
              <!-- 上方文字 -->
              <div class="top-text" @click="goDetail(index)">
                <div class="text-title two-text">{{item.goods_name}}</div>
                <div class="text-spec clearfix">
                  <div class="spec-size fl">规格：{{item.goods_sku}}，</div>
                  <div class="spec-color">重量：{{item.goods_weight}}</div>
                </div>
              </div>
              <!-- 下方价格数量 -->
              <div class="bottom-prinum clearfix">
                <div class="price fl">
                  <div class="price-symbol fl">￥</div>
                  <div class="price-big fl">{{item.goods_price}}</div>
                  <div class="price-small fl">.00</div>
                </div>
                <div class="number fr">
                  <van-stepper @change="totalMoney" v-model="item.goods_num" button-size=".4rem" />
                </div>
                <div class="tag fr clearfix">
                  <div class="tag-del fl" @click="delGoods(index)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-cell>
      </div>
    </div>

    <!-- 商品推荐栏 -->
    <div class="my-recommend" v-show="!isEdit">
      <div class="recommend-title">
        <span class="recommend-text">为您推荐</span>
      </div>
      <Recommend></Recommend>
    </div>

    <!-- 底部提交订单栏 -->
    <div class="bottom-submit">
      <van-submit-bar
        class="bar-sub"
        :price="total"
        button-text="提交订单"
        v-show="!isEdit"
        @submit="submitOrder"
      >
        <van-checkbox v-model="checkedAll" checked-color="#f2373b" @click="checkedGoodsAll">全选</van-checkbox>
      </van-submit-bar>
      <van-submit-bar class="bar-del" button-text="删除" v-show="isEdit" @submit="delMoreGoods">
        <van-checkbox v-model="checkedAll" checked-color="#f2373b" @click="checkedGoodsAll">全选</van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
// 导入样式
import "../../assets/css/mainCss/shopcart.less";
export default {
  name: "Shopcart",

  data() {
    return {
      isShow: false,
      userAccount: "",
      shopcartLocal: [],
      shopcartData: [],
      checkedAll: false, //全选
      total: 0,
      collectList: {},
      isEdit: false,
      delLocal: {},
      delList: {},
      delData: {},
      orderData: {},
    };
  },

  created() {
    // 获取本地存储的用户账号
    this.userAccount = localStorage.getItem("userData");

    // 获取购物车数据
    this.shopcartLocal = Object.values(
      JSON.parse(localStorage.getItem("shopcartData"))[this.userAccount]
    );
    // console.log(this.shopcartLocal);

    // 获取本地存储中的购物车数据
    for (let i = 0; i < this.shopcartLocal.length; i++) {
      // console.log(this.shopcartLocal[i].goods_id)
      this.getShopcartData(this.shopcartLocal[i].goods_id, i);
    }

    this.delLocal = JSON.parse(localStorage.getItem("shopcartData"))[
      this.userAccount
    ];
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

    // 跳转到商品详情页面
    goDetail(index) {
      this.$router.push({
        name: "Detail",
        query: {
          keywords: this.shopcartData[index].keywords,
          goods_id: this.shopcartData[index].goods_id,
        },
      });
    },

    // 获取本地存储中的购物车数据
    getShopcartData(goodsId, index) {
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
          // console.log('getShopcartData => res =>', res);

          // 判断
          if (res.data.meta.status == 200) {
            this.shopcartData.push({
              goods_name: res.data.message.goods_name,
              goods_img: res.data.message.goods_small_logo,
              goods_id: this.shopcartLocal[index].goods_id,
              goods_price: this.shopcartLocal[index].goods_price,
              goods_sku: this.shopcartLocal[index].goods_sku,
              goods_weight: this.shopcartLocal[index].goods_weight,
              goods_num: this.shopcartLocal[index].goods_num,
              keywords: this.shopcartLocal[index].keywords,
              isCheck: false,
            });
          }
          // console.log(this.shopcartData);
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getShopcartData => err =>", err);
        });
    },

    // 全选
    checkedGoodsAll() {
      // 遍历购物车商品数据,根据 isCheck属性判断是否全选
      this.shopcartData.forEach((v) => {
        v.isCheck = this.checkedAll;
      });

      // 计算总金额
      this.totalMoney();
    },

    // 单选
    checkedGoodsOne() {
      // 计算总金额
      this.totalMoney();

      // 判断
      // 当所有单选按钮都为选中状态时
      for (let i = 0; i < this.shopcartData.length; i++) {
        if (!this.shopcartData[i].isCheck) {
          // 取消全选按钮的选中状态
          this.checkedAll = false;
          return;
        }
      }

      // 设置全选按钮状态为选中
      this.checkedAll = true;
    },

    // 计算总金额
    totalMoney() {
      // 每次调用时,把总金额归零
      this.total = 0;

      // 总金额
      this.shopcartData.forEach((v) => {
        if (v.isCheck) {
          this.total += v.goods_price * v.goods_num * 100;
        }
      });
    },

    // 删除购物车商品
    delGoods(index) {
      // 弹出框显示
      this.$dialog
        .confirm({
          title: "删除商品",
          message: "确认要删除此商品?",
          confirmButtonText: "删除",
          confirmButtonColor: "#f2373b",
          cancelButtonText: "返回",
        })
        .then(() => {
          // 删除本地储存的购物车商品数据
          delete [this.delLocal][0][this.shopcartData[index].goods_id];

          // 创建一个新对象重新存储新的购物车数据
          this.delList[this.userAccount] = Object.assign(this.delLocal);

          localStorage.setItem("shopcartData", JSON.stringify(this.delList));

          // 删除页面上的购物车商品
          this.shopcartData.splice(index, 1);
        })
        .catch(() => {});
    },

    // 点击 "编辑商品"
    clickEdit() {
      this.isEdit = !this.isEdit;
    },

    // 删除多个商品
    delMoreGoods() {
      // 获取被选中的商品数据
      let removeGoods = [];
      for (let i = 0; i < this.shopcartData.length; i++) {
        if (this.shopcartData[i].isCheck) {
          removeGoods.push(this.shopcartData[i]);
        }

        // 弹出框显示
        this.$dialog
          .confirm({
            title: "删除商品",
            message: "确认要删除已选中的" + removeGoods.length + "件商品?",
            confirmButtonText: "删除",
            confirmButtonColor: "#f2373b",
            cancelButtonText: "返回",
          })
          .then(() => {
            // 获取不被删除的商品数据
            for (let i = 0; i < this.shopcartData.length; i++) {
              if (!this.shopcartData[i].isCheck) {
                this.delData = Object.assign(
                  {
                    [this.shopcartData[i].goods_id]: this.shopcartData[i],
                  },
                  this.delData
                );
              }
            }

            // 创建一个新对象重新存储新的购物车数据
            this.delList[this.userAccount] = Object.assign(this.delData);
            localStorage.setItem("shopcartData", JSON.stringify(this.delList));

            // 删除页面上的购物车商品
            for (let i = 0; i < removeGoods.length; i++) {
              for (let j = 0; j < this.shopcartData.length; j++) {
                if (removeGoods[i].goods_id == this.shopcartData[j].goods_id) {
                  this.shopcartData.splice(i, removeGoods.length);
                }
              }
            }
          })
          .catch(() => {});
      }
    },

    // 根据当前时间和随机数生成订单编号
    randomOrderNo(n) {
      let orderNo = "";
      for (let i = 0; i < n; i++) {
        //生成 n位随机数字,加在时间戳后面
        orderNo += Math.floor(Math.random() * 10);
      }
      orderNo = "_s" + new Date().getTime() + orderNo;
      return orderNo;
    },

    // 提交订单
    submitOrder() {
      // 获取选中的购物车商品并提交订单
      for (let i = 0; i < this.shopcartData.length; i++) {
        if (this.shopcartData[i].isCheck) {
          this.orderData = Object.assign(
            {
              [this.shopcartData[i].goods_id]: this.shopcartData[i],
            },
            this.orderData
          );
        }
      }

      // 创建一个新对象作为订单数据存储到本地
      let orderList = JSON.parse(localStorage.getItem("orderData"));
      // 生成订单编号
      let order_No = this.randomOrderNo(6);
      orderList[this.userAccount][order_No] = Object.assign(this.orderData);
      // console.log(orderList);
      localStorage.setItem("orderData", JSON.stringify(orderList));

      // 携带订单编号跳转到"提交订单"页面
      this.$router.push({
        name: 'Pay',
        query: {
          sids: order_No
        }
      })
    },
  },
};
</script>
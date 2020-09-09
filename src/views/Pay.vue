<template>
  <div class="pay">
    <!-- 顶部标题栏 -->
    <div class="top-title">
      <van-nav-bar title="提交订单" left-arrow :fixed="true" @click-left="goBack">
        <template #right>
          <van-icon name="ellipsis" color="#5E606B" size=".7rem" @click="isShow = !isShow" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 跳转选项栏 -->
    <div class="my-section" v-show="isShow">
      <SkipSection></SkipSection>
    </div>

    <!-- 添加收货地址 -->
    <div class="fixed" :class="{'fixed-active': isSelect}">
      <div class="pay-address" @click="isPopup = !isPopup">
        <van-cell title="添加/选择您的收货地址" is-link arrow-direction="down" v-show="!isSelect">
          <template #icon>
            <van-icon name="location" color="#CCCCCC" size=".55rem" />
          </template>
        </van-cell>
        <van-cell v-show="isSelect">
          <template #title>
            <span class="user-name">{{userInfo.name}}</span>
            <span class="user-tel">{{userInfo.tel}}</span>
          </template>
          <template #label>
            <div class="user-address one-text">{{userInfo.address}}</div>
          </template>
        </van-cell>
      </div>
    </div>

    <!-- 订单商品栏 -->
    <div class="pay-goods">
      <div class="goods-top">
        <van-icon name="shop-o" color="#9C9C9C" size=".55rem" />
      </div>
      <div class="goods-middle clearfix" v-for="(item, index) in goodsData[0]" :key="index">
        <div class="middle-img fl">
          <img class="auto-img" v-lazy="item.goods_img" alt />
        </div>
        <div class="middle-text fl clearfix">
          <div class="text-title two-text">{{item.goods_name}}</div>
          <div class="text-sku one-text">规格：{{item.goods_sku}}，重量：{{item.goods_weight}}</div>
          <div class="text-p">
            <span class="text-price">
              <span class="price-small">￥</span>
              <span class="price-big">{{item.goods_price}}</span>
              <span class="price-small">.00</span>
            </span>
            <span class="text-count fr">×{{item.goods_num}}</span>
          </div>
          <div class="text-info clearfix">
            <span class="info-returned fl">
              <img
                class="auto-img info-img"
                :src="require('../assets/images/pay_returned.png')"
                alt
              />
              <span class="info-txt">支持7天无理由退货</span>
            </span>
            <span class="info-explain fl">
              <img
                class="auto-img info-img"
                :src="require('../assets/images/pay_explain.png')"
                alt
                @click="clickDialog"
              />
              <span class="info-txt">价格说明</span>
            </span>
          </div>
        </div>
      </div>
      <div class="goods-bottom clearfix">
        <div class="bottom-txt fl">
          <div class="bottom-title clearfix">
            <span class="title-left fl">配送</span>
            <span class="title-right fr">快递运输</span>
          </div>
          <div class="bottom-text clearfix">
            <span class="text-left fl">中小件送货时间</span>
            <span class="text-right fr">工作日、双休日与节假日均可送货</span>
          </div>
        </div>
        <div class="bottom-icon fl">
          <van-icon name="arrow" color="#ccc" />
        </div>
      </div>
    </div>

    <!-- 商品金额栏 -->
    <div class="pay-money clearfix">
      <div class="money-num">
        <div class="money-goods clearfix">
          <span class="money-goods-text fl">商品金额</span>
          <span class="money-goods-num fr">￥{{total}}.00</span>
        </div>
        <div class="money-goods clearfix">
          <span class="money-goods-text fl">运费</span>
          <span class="money-goods-num fr">+￥0.00</span>
        </div>
      </div>
      <div class="money-amount fr">
        <span class="amount-text">实付金额：</span>
        <span class="amount-num">￥{{total}}.00</span>
      </div>
      <div class="money-btn">
        <van-button round color="#3884FF" block @click="settlement">立即结算</van-button>
      </div>
      <div class="money-info">
        <div class="info-txt">此订单不支持以下支付方式</div>
      </div>
      <div class="money-delivery clearfix">
        <div class="delivery-icon fl">
          <img class="auto-img" :src="require('../assets/images/pay_delivery.png')" alt />
        </div>
        <div class="delivery-text fl">
          <div class="delivery-title">货到付款</div>
          <div class="delivery-content">需填写收货地址以判断是否支持货到付款,立即填写</div>
        </div>
        <div class="delivery-right fr">
          <van-icon name="arrow" color="#ccc" />
        </div>
      </div>
    </div>

    <!-- 选择地址弹出层 -->
    <div class="pay-choose">
      <van-popup class="pay-popup" v-model="isPopup" position="bottom" round>
        <van-address-list
          v-model="chosenAddressId"
          :list="addressList"
          default-tag-text="默认"
          @select="selectAddress"
          @add="goPage('NewAddress')"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
// 引入样式
import "../assets/css/pay.less";

export default {
  name: "Pay",
  data() {
    return {
      isShow: false,
      isPopup: false,
      userAccount: "",
      orderData: {},
      goodsData: [],
      total: 0,
      chosenAddressId: "1",
      addressList: [],
      isSelect: false,
      userInfo: {
        name: "",
        tel: "",
        address: "",
      },
      settlementInfo: {},
    };
  },
  created() {
    // 获取地址栏的订单编号
    let order_No = this.$route.query.sids;

    // 获取本地存储数据
    this.userAccount = localStorage.getItem("userData");
    this.orderData = JSON.parse(localStorage.getItem("orderData"));

    for (let key in this.orderData[this.userAccount]) {
      if (key == order_No) {
        this.goodsData.push(this.orderData[this.userAccount][key]);
      }
    }

    // 计算总金额
    this.totalMoney();

    // 获取本地储存中的地址数据
    this.getAddressByLocal();
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

    // 点击图标弹出"价格说明"提示框
    clickDialog() {
      this.$dialog
        .alert({
          title: "价格说明",
          message:
            "因可能存在系统缓存、页面更新导致价格变动异常等不确定性情况出现，商品售价以本结算页商品价格为准；如有疑问，请您立即联系销售商咨询。",
          theme: "round-button",
          confirmButtonText: "知道了",
          confirmButtonColor: "#f2373b",
        })
        .then(() => {});
    },

    // 计算总金额
    totalMoney() {
      // 每次调用时,把总金额归零
      this.total = 0;

      // 总金额
      for (let key in this.goodsData[0]) {
        this.total +=
          this.goodsData[0][key].goods_price * this.goodsData[0][key].goods_num;
      }
    },

    // 获取本地储存中的地址数据
    getAddressByLocal() {
      let addressData = JSON.parse(localStorage.getItem("addressData"))[
        this.userAccount
      ];
      console.log(addressData);

      for (let key in addressData) {
        let value = addressData[key];
        this.curAddress = {
          id: value.addressId,
          name: value.name,
          tel: value.tel,
          address:
            value.province == value.city
              ? value.addressTag == ""
                ? "" + value.city + value.county + value.addressDetail
                : value.addressTag +
                  " > " +
                  value.city +
                  value.county +
                  value.addressDetail
              : value.addressTag == ""
              ? "" +
                value.province +
                value.city +
                value.county +
                value.addressDetail
              : value.addressTag +
                " > " +
                value.province +
                value.city +
                value.county +
                value.addressDetail,
          isDefault: value.isDefault,
          addressTag: value.addressTag,
        };

        if (value.isDefault) {
          this.chosenAddressId = value.addressId;
        }

        this.addressList.push(this.curAddress);
      }
    },

    // 选择地址
    selectAddress(item) {
      this.isPopup = false;
      this.isSelect = true;

      // 处理详细地址数据
      let addressDetail =
        item.addressTag == "" ? item.address : item.address.split(" ")[2];

      this.userInfo = {
        name: item.name,
        tel: item.tel,
        address: addressDetail,
      };
    },

    // 结算订单
    settlement() {
      let settlementList = JSON.parse(localStorage.getItem('settlementData'));

      // 获取订单编号
      let order_No = this.$route.query.sids;
      this.settlementInfo = Object.assign(this.settlementInfo, {
        [order_No]: this.goodsData[0]
      });
      
      // 把结算的订单放入结算数据中的全部订单和待收货订单中
      settlementList[this.userAccount].orderAll = Object.assign(settlementList[this.userAccount].orderAll, this.settlementInfo);
      settlementList[this.userAccount].orderAwait = Object.assign(settlementList[this.userAccount].orderAll, this.settlementInfo);

      // 获取并操作购物车本地存储数据
      let shopcartList = JSON.parse(localStorage.getItem('shopcartData'))[this.userAccount];
      for(let key in shopcartList) {
        for(let k in this.settlementInfo[order_No]) {
          if(key == k) {
            delete shopcartList[key]
          }
        }
      }
      let shopcartInfo = {
        [this.userAccount]: shopcartList
      }
      
      // 把数据放入本地存储中
      localStorage.setItem('shopcartData', JSON.stringify(shopcartInfo));
      localStorage.setItem('settlementData', JSON.stringify(settlementList));

      // 跳转到订单页面
      this.$router.push({name: 'Order'});
    }
  },
};
</script>
<template>
  <div class="myAddress">
    <!-- 顶部标题栏 -->
    <div class="top-title">
      <van-nav-bar title="收货地址" left-arrow :fixed="true" @click-left="goBack"></van-nav-bar>
    </div>

    <!-- 地址列表栏 -->
    <div class="address-list">
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        @add="goAddress"
        @edit="goAddress"
      />
    </div>
  </div>
</template>

<script>
// 导入样式
import "../assets/css/myAddress.less";

export default {
  name: "MyAddress",
  data() {
    return {
      chosenAddressId: "1",
      addressList: [],
      curAddress: {},
      addressTag: "",
    };
  },
  created() {
    // 获取用户账号数据
    this.userAccount = localStorage.getItem("userData");

    // 获取地址数据
    this.getAddressData();
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

    // 获取地址数据
    getAddressData() {
      let addressData = JSON.parse(localStorage.getItem("addressData"))[
        this.userAccount
      ];

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

    // 新增地址和编辑地址
    goAddress(address) {
      let queryObj = {
        name: "NewAddress",
      };

      if (address) {
        queryObj.query = {
          addressId: address.id,
        };
      }

      this.$router.push(queryObj);
    },
  },
};
</script>
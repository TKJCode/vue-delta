<template>
  <div class="newAddress">
    <!-- 顶部标题栏 -->
    <div class="top-title">
      <van-nav-bar
        :title="!!addressId ? '编辑地址' : '新增地址'"
        left-arrow
        :fixed="true"
        @click-left="goBack"
      ></van-nav-bar>
    </div>

    <!-- 地址编辑栏 -->
    <div class="address-edit">
      <van-address-edit
        :area-list="areaList"
        :show-postal="false"
        :show-delete="!!addressId"
        show-set-default
        show-search-result
        :address-info="addressInfo"
        save-button-text="保存地址"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="saveAddress"
        @delete="delAddress"
      >
        <template #default>
          <div class="van-cell van-field">
            <div class="van-cell__title van-field__label">
              <span>地址标签</span>
            </div>
            <div class="van-cell__value van-field__value">
              <div class="van-field__body">
                <div
                  class="address-tag"
                  :class="{'cur': item.isCur}"
                  v-for="(item, index) in addressTag"
                  :key="index"
                  @click="toggleCur(item)"
                >{{item.title}}</div>
              </div>
              <div class="van-field__body">
                <span class="address-tag" :class="{'cur': isCustom}" @click="toggleCustom">
                  {{isDialogText ? dialogText : '自定义'}}
                  <i
                    class="tag-add"
                    v-show="!isDialogText"
                    @click="isDialog = true"
                  ></i>
                </span>
                <span class="address-tag-edit" v-show="isDialogText" @click="isDialog = true"></span>
              </div>
            </div>
          </div>
        </template>
      </van-address-edit>
    </div>

    <!-- "自定义标签名称"弹出框 -->
    <van-dialog v-model="isDialog" title="自定义标签名称" show-cancel-button @confirm="dialogConfirm">
      <div class="dialog">
        <input
          v-model="dialogText"
          class="dialog-input"
          value
          type="text"
          placeholder="标签最多填写八个字"
          maxlength="8"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script>
// 导入样式
import "../assets/css/newAddress.less";
// 导入 area.js
import areaList from "../assets/js/area";

export default {
  name: "NewAddress",
  data() {
    return {
      userAccount: "",
      areaList,
      isDialog: false,
      isDialogText: false,
      dialogText: "",
      isCustom: false,
      addressTag: [
        {
          title: "公司",
          isCur: false,
        },
        {
          title: "家",
          isCur: false,
        },
        {
          title: "学校",
          isCur: false,
        },
      ],
      addressId: "",
      addressInfo: {},
      addressLi: {},
    };
  },
  created() {
    // 获取用户账号数据
    this.userAccount = localStorage.getItem("userData");

    // 获取地址 id
    this.addressId = this.$route.query.addressId;

    // 根据地址栏中的 addressId获取地址数据
    if (this.addressId) {
      this.getAddressById();
    }
  },
  methods: {
    // 跳转页面
    goPage(name) {
      this.$router.push({ name });
    },

    // 返回上一级页面
    goBack() {
      this.$router.go(-1);
    },

    // 切换地址标签
    toggleCur(item) {
      if (item.isCur) {
        item.isCur = false;
        return;
      }
      for (let i = 0; i < this.addressTag.length; i++) {
        if (this.addressTag[i].isCur) {
          this.addressTag[i].isCur = false;
          break;
        }
      }
      item.isCur = true;
      this.isCustom = false;
      this.addressLi.addressTag = item.title;
    },

    // 切换自定义地址标签
    toggleCustom() {
      if (!this.isDialogText) {
        return;
      }
      for (let i = 0; i < this.addressTag.length; i++) {
        if (this.addressTag[i].isCur) {
          this.addressTag[i].isCur = false;
          break;
        }
      }
      this.isCustom = !this.isCustom;
    },

    // 点击地址标签选择框"确认"
    dialogConfirm() {
      this.isCustom = true;
      this.isDialogText = true;
      for (let i = 0; i < this.addressTag.length; i++) {
        if (this.addressTag[i].isCur) {
          this.addressTag[i].isCur = false;
          break;
        }
      }
    },

    // 根据当前时间戳生成地址编号
    randomAddressNo() {
      let addressNo = "";
      addressNo = "_address" + new Date().getTime();
      return addressNo;
    },

    // 保存地址
    saveAddress(addressData) {
      // 判断数据是否相同的布尔值
      let isSame = true;

      let tags = "";
      this.addressTag.forEach((v) => {
        if (v.isCur) {
          tags = v.title;
        }
      });
      if (this.isCustom) {
        tags = this.dialogText;
      }
      addressData["addressTag"] = tags;

      // 判断修改后的数据是否与原来的数据一样
      if (this.addressId) {
        for (let key in this.addressInfo) {
          if (this.addressInfo[key] != addressData[key]) {
            isSame = false;
          }
        }
      }

      // 判断是否为新增地址还是编辑地址
      if (this.addressId) {
        // 编辑地址
        if (!isSame) {
          let userAddress = Object.assign({}, this.addressInfo);

          // 把修改编辑后的地址放入新地址中
          for (let key in userAddress) {
            userAddress[key] = addressData[key];
          }
          // 创建一个新对象存放地址数据
          let addressList = JSON.parse(localStorage.getItem("addressData"));
          // 把修改后的地址重新放入对象内
          for (let key in addressList[this.userAccount]) {
            if (this.addressId == key) {
              addressList[this.userAccount][key] = userAddress;
            }
          }
          // 保证默认地址的唯一性
          if (addressData.isDefault) {
            for (let key in addressList[this.userAccount]) {
              addressList[this.userAccount][key].isDefault = false;
            }
          }
          // 重新创建一个新的本地储存地址对象
          addressList[this.userAccount][this.addressId] = Object.assign(
            addressData
          );
          console.log(addressList);
          localStorage.setItem("addressData", JSON.stringify(addressList));

          // 开启加载提示
          this.$toast.loading({
            duration: 200,
            message: "加载中...",
            forbidClick: true,
            onClose: this.goPage("MyAddress"),
          });
        }
      } else {
        // 新增地址
        // 遍历标签数据把地址标签加入到地址数据内
        let tags = "";
        this.addressTag.forEach((v) => {
          if (v.isCur) {
            tags = v.title;
          }
        });
        if (this.isCustom) {
          tags = this.dialogText;
        }
        addressData["addressTag"] = tags;
        // 创建一个新对象存放地址数据
        let addressList = JSON.parse(localStorage.getItem("addressData"));
        // 创建地址 id和地址唯一编号
        let addressNo = this.randomAddressNo();
        addressData["addressId"] = addressNo;

        // 保证默认地址的唯一性
        if (addressData.isDefault) {
          for (let key in addressList[this.userAccount]) {
            addressList[this.userAccount][key].isDefault = false;
          }
        }
        addressList[this.userAccount][addressNo] = Object.assign(addressData);
        localStorage.setItem("addressData", JSON.stringify(addressList));

        // 开启加载提示
        this.$toast.loading({
          duration: 200,
          message: "加载中...",
          forbidClick: true,
          onClose: this.goPage("MyAddress"),
        });
      }
    },

    // 编辑地址
    // 根据地址栏中的 addressId获取地址数据
    getAddressById() {
      let addressList = JSON.parse(localStorage.getItem("addressData"))[
        this.userAccount
      ];

      for (let key in addressList) {
        if (this.addressId == key) {
          this.addressInfo = addressList[key];
        }
      }

      for (let i = 0; i < this.addressTag.length; i++) {
        if (this.addressInfo.addressTag == this.addressTag[i].title) {
          this.addressTag[i].isCur = true;
          break;
        } else if (this.addressInfo.addressTag == "") {
          break;
        } else {
          this.isCustom = true;
          this.isDialogText = true;
          this.dialogText = this.addressInfo.addressTag;
          break;
        }
      }
    },

    // 删除地址
    delAddress() {
      let addressList = JSON.parse(localStorage.getItem("addressData"));

      for (let key in addressList[this.userAccount]) {
        if (key == this.addressId) {
          delete addressList[this.userAccount][key];
        }
      }
      localStorage.setItem("addressData", JSON.stringify(addressList));

      // 开启加载提示
      this.$toast.loading({
        duration: 200,
        message: "加载中...",
        forbidClick: true,
        onClose: this.goPage("MyAddress"),
      });
    },
  },
};
</script>
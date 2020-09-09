<template>
  <div class="register">
    <div class="register-top">
      <!-- 顶部导航栏 -->
      <van-nav-bar title="登录" @click-left="goBack" @click-right="goPage('Register')">
        <template #left>
          <van-icon name="arrow-left" color="#fff" size=".65rem" />
        </template>
        <template #right>
          <div class="text-login">注册</div>
        </template>
      </van-nav-bar>

      <!-- 注册输入框 -->
      <div class="register-ipt">
        <van-form @submit="login">
          <!-- 通过 pattern 进行正则校验 -->
          <van-field
            v-model="userInfo.phone"
            type="text"
            name="手机号"
            label="手机号"
            label-width="1.5rem"
            placeholder="请输入手机号"
          >
            <template v-slot:left-icon>
              <i class="fa fa-tablet fa-lg fa-fw"></i>
            </template>
          </van-field>
          <!-- <van-field
            v-model="userInfo.verifyCode"
            type="text"
            name="code"
            label="验证码"
            label-width="1.5rem"
            placeholder="请输入验证码"
          >
            <template v-slot:left-icon>
              <i class="fa fa-check fa-lg fa-fw"></i>
            </template>
            <template #button>
              <van-button
                @click="clickCode"
                size="small"
                color="linear-gradient(to right, #f25053, #f2373b)"
              >发送验证码</van-button>
            </template>
          </van-field>-->
          <van-field
            v-model="userInfo.password"
            :type="isEye ? 'text' : 'password'"
            name="password"
            label="密码"
            label-width="1.5rem"
            placeholder="请输入密码"
            @click-right-icon="togglePassword"
          >
            <template v-slot:left-icon>
              <i class="fa fa-lock fa-lg fa-fw"></i>
            </template>
            <template v-slot:right-icon>
              <i
                @click-right-icon="togglePassword"
                :class="isEye ? 'fa-eye' : 'fa-eye-slash'"
                class="fa fa-eye fa-lg fa-fw"
              ></i>
            </template>
          </van-field>

          <div class="register-btn">
            <van-button
              color="linear-gradient(to right, #f25053, #f2373b)"
              round
              block
              type="info"
              native-type="submit"
            >登录</van-button>
          </div>
        </van-form>
      </div>

      <!-- 底部跳转栏 -->
      <div class="register-bottom">
        <span class="bottom-text">
          忘记密码？去
        </span>
        <span @click="goPage('Login')">
          <span class="bottom-login">&nbsp;找回</span>
          <span>
            <van-icon class="bottom-icon" name="arrow" color="#999" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// 导入样式
import '../assets/css/registerLog.less';

// 导入验证表单模块
import validForm from '../assets/js/validForm';

export default {
  name: "Register",

  data() {
    return {
      userInfo: {
        phone: "",
        password: ""
      },

      // 密码框内的眼睛(false表示闭合,true表示睁开)
      isEye: false
    };
  },

  methods: {
    // 跳转页面
    goPage(name) {
      this.$router.push({name});
    },

    // 返回上一级页面
    goBack() {
      this.$router.go(-1);
    },

    // 切换密码格式
    togglePassword() {
      this.isEye = !this.isEye;
    },

    // 点击发送验证码
    clickCode() {
      this.$toast("已发送验证码，请注意查收");
    },

    // 登录
    login() {
      // 验证登录信息
      // 验证表单
      if (validForm.validUserForm(this.userInfo)) {
        // 合并复制对象
        let data = Object.assign({}, this.userInfo);

        // 额外在 data对象中添加 appkey属性
        data.appkey = this.appkey;

        // 开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,

          //延迟自动关闭加载提示(如果值为 0,则不会自动关闭)
          duration: 0
        });

        // 发起请求登录
        this.axios({
          method: "POST",
          url: "http://www.kangliuyong.com:10002/login",

          // post传递参数需要写在 data里
          data
        })
          .then(result => {
            // 关闭加载提示
            this.$toast.clear();

            console.log("result =>", result);

            // 跳转
            if (result.data.code == 200) {
              // console.log("登录成功");

              // 存储 token,用于后面登录验证
              localStorage.setItem("__Token", result.data.token);
              // console.log("token =>", result.data.token);
              
              // 跳转到首页页面
              this.$router.push({ name: "Home" });

              // 获取本地存储数据
              localStorage.setItem('userData', this.userInfo.phone);

              let shopcartData = JSON.parse(localStorage.getItem('shopcartData'));
              let collectData = JSON.parse(localStorage.getItem('collectData'));
              let orderData = JSON.parse(localStorage.getItem('orderData'));
              let addressData = JSON.parse(localStorage.getItem('addressData'));
              let settlementData = JSON.parse(localStorage.getItem('settlementData'));

              if(!shopcartData[this.userInfo.phone]) {
                shopcartData[this.userInfo.phone] = {};
                localStorage.setItem('shopcartData', JSON.stringify(shopcartData));
              }
              if(!collectData[this.userInfo.phone]) {
                collectData[this.userInfo.phone] = {};
                localStorage.setItem('collectData', JSON.stringify(collectData));
              }
              if(!orderData[this.userInfo.phone]) {
                orderData[this.userInfo.phone] = {};
                localStorage.setItem('orderData', JSON.stringify(orderData));
              }
              if(!addressData[this.userInfo.phone]) {
                addressData[this.userInfo.phone] = {};
                localStorage.setItem('addressData', JSON.stringify(addressData));
              }
              if(!settlementData[this.userInfo.phone]) {
                settlementData[this.userInfo.phone] = {
                  orderAll: {},
                  orderAwait: {},
                  orderReceived: {}
                };
                localStorage.setItem('settlementData', JSON.stringify(settlementData));
              }

            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            // 关闭加载提示
            this.$toast.clear();

            console.log("err =>", err);
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
// ==================== 修改 vant组件样式 ====================
/deep/ .van-icon-arrow-left::before {
  padding: 0;
  margin: 0;
}
/deep/ .van-nav-bar {
  background-image: linear-gradient(to right, #f25053, #f2373b);
}
/deep/ .van-nav-bar__title {
  color: #fff;
  font-size: 18px;
  line-height: 46px;
}
.van-hairline--bottom::after {
  border: 0;
}
/deep/ .van-field {
  top: 39px;
  margin-top: 10px;
}
/deep/ .bottom-icon::before {
  padding: 0;
  margin: 0;
  position: absolute;
  bottom: -2px;
}
</style>
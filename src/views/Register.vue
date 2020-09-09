<template>
  <div class="register">
    <div class="register-top">
      <!-- 顶部导航栏 -->
      <van-nav-bar title="注册" @click-left="goBack">
        <template #left>
          <van-icon name="arrow-left" color="#fff" size=".65rem" />
        </template>
      </van-nav-bar>

      <!-- 注册步骤条 -->
      <van-steps active-icon="success" active-color="#fff" inactive-icon="arrow">
        <van-step>开始</van-step>
        <van-step>填写资料</van-step>
        <van-step>上传头像</van-step>
        <van-step>完成</van-step>
      </van-steps>

      <!-- 注册输入框 -->
      <div class="register-ipt">
        <van-form @submit="register">
          <van-field
            v-model="userInfo.phone"
            type="text"
            name="手机号"
            label="手机号"
            label-width="1.5rem"
            placeholder="请输入手机号"
            clearable
            maxlength="11"
          >
            <template v-slot:left-icon>
              <i class="fa fa-tablet fa-lg fa-fw"></i>
            </template>
          </van-field>
          <van-field
            v-model="userInfo.nickName"
            type="text"
            name="code"
            label="昵称"
            label-width="1.5rem"
            placeholder="请输入昵称"
            clearable
            maxlength="4"
          >
            <template v-slot:left-icon>
              <i class="fa fa-user-circle-o fa-lg fa-fw"></i>
            </template>
          </van-field>
          <van-field
            v-model="userInfo.password"
            :type="isEye ? 'text' : 'password'"
            name="password"
            label="密码"
            label-width="1.5rem"
            placeholder="请输入密码"
            @click-right-icon="togglePassword"
            clearable
            maxlength="16"
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
            >下一步</van-button>
          </div>
        </van-form>
      </div>

      <!-- 底部跳转栏 -->
      <div class="register-bottom">
        <span class="bottom-text" @click="goPage('login')">已有账号，去</span>
        <span @click="goPage('Login')">
          <span class="bottom-login">&nbsp;登录</span>
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
import "../assets/css/registerLog.less";

// 导入验证表单模块
import validForm from "../assets/js/validForm";

export default {
  name: "Register",

  data() {
    return {
      userInfo: {
        phone: "",
        nickName: "",
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

    // 注册
    register() {
      // 验证注册信息
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

        // 发起请求注册
        this.axios({
          method: "POST",
          url: "http://www.kangliuyong.com:10002/register",

          // post传递参数需要写在 data里
          data
        })
          .then(result => {
            // 关闭加载提示
            this.$toast.clear();

            console.log("result =>", result);

            // 跳转
            if (result.data.code == 100) {
              // 跳转到登录页面
              this.$router.push({ name: "Login" });
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
.van-steps {
  background-image: linear-gradient(to right, #f25053, #f2373b);
  font-size: 18px;
  width: 80%;
  position: absolute;
  top: 115px;
  left: 10%;
  padding: 0;
}
/deep/ .van-step__icon--active::before,
/deep/ .van-step__icon::before {
  font-size: 14px;
  margin-top: 6px;
  padding-left: 7px;
}
/deep/ .van-step__icon--active::before {
  color: #f2373b;
}

/deep/ .van-step__title {
  font-size: 16px;
  font-weight: normal;
}
/deep/ .van-step__title--active {
  font-weight: bold;
}
/deep/ .van-step {
  color: #d3d3d3;
  font-weight: normal;
}
/deep/ .van-step__circle-container {
  width: 25px;
  height: 25px;
  border-radius: 30px;
  margin-top: 7px;
}
/deep/ .van-step__line {
  margin-top: 7px;
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
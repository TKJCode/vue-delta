import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入用于设置 rem 基准值模块
import 'lib-flexible'

// 导入配置 font-awesome字体图标库
import 'font-awesome/css/font-awesome.min.css'

// 引入 axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// 引入全局组件
import Recommend from './components/Recommend/index'
import SkipSection from './components/SkipSection/index'
import NavPopup from './components/NavPopup/index'

// 导入 vant框架
import {
  Button,
  NavBar,
  Icon,
  Step,
  Steps,
  Form,
  Field,
  Toast,
  Tabbar, 
  TabbarItem,
  Search,
  Col, 
  Row,
  SwipeCell,
  Cell,
  Checkbox, 
  CheckboxGroup,
  Stepper,
  SubmitBar,
  CountDown,
  Sku,
  Swipe, 
  SwipeItem,
  Lazyload,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  List,
  ActionSheet,
  Tab, 
  Tabs,
  ShareSheet,
  Popup,
  RadioGroup, 
  Radio,
  Dialog,
  AddressEdit,
  AddressList,
} from 'vant'

// 注册 vant框架组件
Vue
  .use(Button)
  .use(NavBar)
  .use(Icon)
  .use(Step)
  .use(Steps)
  .use(Form)
  .use(Field)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Col)
  .use(Row)
  .use(SwipeCell)
  .use(Cell)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Stepper)
  .use(SubmitBar)
  .use(CountDown)
  .use(Sku)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(List)
  .use(ActionSheet)
  .use(Tab)
  .use(Tabs)
  .use(ShareSheet)
  .use(Popup)
  .use(RadioGroup)
  .use(Radio)
  .use(Dialog)
  .use(AddressEdit)
  .use(AddressList)

// 注册 axios
Vue.use(VueAxios, axios)

// 注册自定义组件
Vue.use(Recommend)
Vue.use(SkipSection)
Vue.use(NavPopup)

// ==========================================
// 配置请求基础路径
axios.defaults.baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'

// 配置 post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// 发起请求之前处理
axios.interceptors.request.use(config => {
  // console.log('config =>', config);

  if(config.method === 'post') {
    // 定义空字符串
    let paramsString = '';

    // post请求参数序列化,把数据 data转成字符串类型
    for(let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&';
    }

    // 去掉字符串最后多余的 "&"
    config.data = paramsString.slice(0, -1);

    // 查看控制台数据
    console.log('paramsString =>', paramsString);
    console.log('config.data =>', config.data);
  }

  return config;
})
// ==========================================

Vue.config.productionTip = false

// 添加 appkey属性保存 appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import MyRecommend from './Recommend.vue'

const Recommend = {
  install: function(Vue) {
    Vue.component('Recommend', MyRecommend)
  }
}

// 导出组件
export default Recommend
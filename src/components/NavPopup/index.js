import MyPopup from './NavPopup.vue';

const NavPopup = {
  install: function(Vue) {
    Vue.component('NavPopup', MyPopup)
  }
}

// 导出组件
export default NavPopup
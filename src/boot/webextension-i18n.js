import Vue from 'vue'

const i18n = function (name) {
  return chrome.i18n.getMessage(name)
}
Vue.prototype.$i18n = i18n

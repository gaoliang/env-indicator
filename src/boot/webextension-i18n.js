const i18n = function (name) {
  return chrome.i18n.getMessage(name)
}
export default ({ app, router, store }) => {
  app.config.globalProperties.$i18n = i18n
}

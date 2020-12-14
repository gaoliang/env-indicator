// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
import { ribbonCorner } from 'ribbon-corner'

const initEnvs = [{
  "envBackgroundColor": "#00a300",
  "textColor": "#FFFFFF",
  "envName": "Dev 🤣",
  "position": "left",
  "ruleType": "regex",
  "shape": "triangle",
  "ruleValue": "(localhost)|(127.0.0.1).*"
}, {
  "envBackgroundColor": "#ffff00",
  "textColor": "#666666",
  "envName": "Staging 👀",
  "position": "left",
  "ruleType": "regex",
  "shape": "triangle",
  "ruleValue": "(st\\.)|(staging\\.)"
}, {
  "envBackgroundColor": "#ff8000",
  "textColor": "#FFFFFF",
  "envName": "Preview 🚗",
  "position": "left",
  "ruleType": "regex",
  "shape": "ribbon",
  "ruleValue": "(pre\\.)|(preview)"
}, {
  "envBackgroundColor": "#ff6666",
  "textColor": "#FFFFFF",
  "envName": "Production ⚠️",
  "position": "left",
  "ruleType": "suffix",
  "shape": "ribbon",
  "ruleValue": ".srv"
}];

export default function attachContentHooks(/* bridge */) {
  // Hook into the bridge to listen for events sent from the client BEX.
  /*
  bridge.on('some.event', event => {
    if (event.data.yourProp) {
      // Access a DOM element from here.
      // Document in this instance is the underlying website the contentScript runs on
      const el = document.getElementById('some-id')
      if (el) {
        el.value = 'Quasar Rocks!'
      }
    }
  })
  */
}

function setEnv(env) {

  if (env.shape === 'triangle') {
    ribbonCorner({
      backgroundColor: env.envBackgroundColor,
      toCorner: 30,
      height: 60,
      horizontalAlign: env.position,
      text: env.envName,
      textColor: env.textColor,
      position: 'fixed',
      fontSize: 14
    })
    document.getElementsByClassName("ribbon-corner")[0].prepend(document.createElement("br"))
  } else {
    ribbonCorner({
      backgroundColor: env.envBackgroundColor,
      toCorner: 60,
      height: 40,
      horizontalAlign: env.position,
      text: env.envName,
      textColor: env.textColor,
      position: 'fixed',
      fontSize: 14
    })
  }

}

// TODO: use await
chrome.storage.sync.get(['envs'], function (result) {

  let envs = result.envs
  if (result.envs === undefined) {
    envs = initEnvs;
    chrome.storage.sync.set({
      'envs': envs
    }, function () {
      console.log("env indicator 数据初始化成功!")
    });
  }

  const domain = window.location.hostname
  for (let env of envs) {
    switch (env.ruleType) {
      case "contains":
        if (domain.includes(env.ruleValue.toLowerCase())) {
          setEnv(env)
          return;
        }
        break
      case "prefix":
        if (domain.startsWith(env.ruleValue.toLowerCase())) {
          setEnv(env)
          return;
        }
        break
      case "suffix":
        if (domain.endsWith(env.ruleValue.toLowerCase())) {
          setEnv(env)
          return;
        }
        break
      case "regex":
        const regex = RegExp(env.ruleValue);
        if (regex.test(domain)) {
          setEnv(env)
          return;
        }
    }
  }
});

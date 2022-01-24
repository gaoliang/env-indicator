// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
import { ribbonCorner } from 'ribbon-corner'
import defaultEnvs from '../../src/assets/defaultEnvs.json'
const browser = require('webextension-polyfill')

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
    document.getElementsByClassName('ribbon-corner')[0].prepend(document.createElement('br'))
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

browser.storage.sync.get(['enable', 'envs']).then(result => {
  // only return on enable is false
  if (result.enable === false) {
    return
  }

  let envs = result.envs
  if (result.envs === undefined) {
    envs = defaultEnvs
    browser.storage.sync.set({
      envs: envs
    }).then(() => {
      console.log('env indicator init default envs success!')
    })
  }

  const domain = window.location.host
  for (const env of envs) {
    switch (env.ruleType) {
      case 'contains':
        if (domain.includes(env.ruleValue.toLowerCase())) {
          setEnv(env)
          return
        }
        break
      case 'prefix':
        if (domain.startsWith(env.ruleValue.toLowerCase())) {
          setEnv(env)
          return
        }
        break
      case 'suffix':
        if (domain.endsWith(env.ruleValue.toLowerCase())) {
          setEnv(env)
          return
        }
        break
      case 'regex':
        if (RegExp(env.ruleValue).test(domain)) {
          setEnv(env)
          return
        }
    }
  }
})

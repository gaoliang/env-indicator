// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks
import {ribbenCorner} from 'ribbon-corner'

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
  ribbenCorner({
    backgroundColor: env.envBackgroundColor,
    toCorner: 100,
    height: 50,
    horizontalAlign: env.position,
    text: env.envName,
    textColor: 'white',
    position: 'fixed',
    fontSize: 15
  })
}

// TODO: use await
chrome.storage.sync.get(['envs'], function (result) {
  const domain = window.location.hostname
  let envs = result.envs
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

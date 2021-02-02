# Environment Indicator Browser Extension


<p align="center">
  <a href="https://vuepress.vuejs.org/" target="_blank">
    <img width="180" src="https://raw.githubusercontent.com/gaoliang/env-indicator/master/docs/docs/.vuepress/public/indicator.png" alt="logo">
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.com/gaoliang/env-indicator"><img src="https://travis-ci.com/gaoliang/env-indicator.svg?branch=main" alt="Chrome Store State"></a>
  <a href="https://chrome.google.com/webstore/detail/env-indicator/kgdbcpllbbnimjgoiomfdebldcofmlbl"><img src="https://img.shields.io/chrome-web-store/v/kgdbcpllbbnimjgoiomfdebldcofmlbl" alt="Chrome Store State"></a>
  <a href="https://chrome.google.com/webstore/detail/env-indicator/kgdbcpllbbnimjgoiomfdebldcofmlbl"><img src="https://img.shields.io/chrome-web-store/users/kgdbcpllbbnimjgoiomfdebldcofmlbl" alt="Chrome Store State"></a>
  <a href="https://chrome.google.com/webstore/detail/env-indicator/kgdbcpllbbnimjgoiomfdebldcofmlbl"><img src="https://img.shields.io/chrome-web-store/stars/kgdbcpllbbnimjgoiomfdebldcofmlbl" alt="Chrome Store Rate"></a>
  <a href="https://addons.mozilla.org/zh-CN/firefox/addon/env-indicator"><img src="https://img.shields.io/amo/v/env-indicator" alt="Firfox store"></a>
</p>

Add an environment marker to differentiate QA environments from production. In addition, you can create your own indicator rules

### Screenshots
![examples](./docs/example.png)
![config](./docs/config.png)

### Features
🌟 1. Support setting the marker as a triangle ◤ or ribbon. 🎗

🌟 2. Support setting the background color and text color of the marker. 🎨

🌟 3. Support to configure the marker to the upper left or upper right corner of the page.

🌟 4. Support regular expression matching, prefix matching, suffix matching and inclusion matching for host to differentiate different environments.

## Develop Guide

### Install the quasar-cli and dependencies
```bash
yarn global add @quasar/cli
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m bex
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
 quasar build -m bex
 ```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

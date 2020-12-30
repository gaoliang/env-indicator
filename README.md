# Environment Indicator Browser Extension

Add an environment marker to differentiate QA environments from production. In addition, you can create your own indicator rules

[![Build Status](https://travis-ci.com/gaoliang/env-indicator.svg?branch=main)](https://travis-ci.com/gaoliang/env-indicator)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kgdbcpllbbnimjgoiomfdebldcofmlbl)](https://chrome.google.com/webstore/detail/env-indicator/kgdbcpllbbnimjgoiomfdebldcofmlbl)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/kgdbcpllbbnimjgoiomfdebldcofmlbl)](https://chrome.google.com/webstore/detail/env-indicator/kgdbcpllbbnimjgoiomfdebldcofmlbl)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/kgdbcpllbbnimjgoiomfdebldcofmlbl)](https://chrome.google.com/webstore/detail/env-indicator/kgdbcpllbbnimjgoiomfdebldcofmlbl)
[![Mozilla Add-on](https://img.shields.io/amo/v/env-indicator)](https://addons.mozilla.org/zh-CN/firefox/addon/env-indicator/)
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

<template>
    <div class="fullscreen row text-center q-pa-md flex flex-center">
      {{ $i18n('extensionName') }}
      <q-toggle size="150px" v-model="enable" v-if="enable !== null" @update:model-value="change"/>
      <br>
      <div>
        <q-btn
          class="q-mt-xl"
          unelevated
          @click="goOptions"
          :label="this.$i18n('preferences')"
          no-caps
        />
      </div>
    </div>
  </template>
  
  <script>
  import browser from 'webextension-polyfill'
  
  export default {
    data () {
      return {
        enable: null
      }
    },
    methods: {
      goOptions () {
        browser.tabs.create({
          url: browser.runtime.getURL('www/index.html')
        }).then((/* newTab */) => {
          // Tab opened.
        })
      },
      change () {
        this.$q.notify({
          position: 'top',
          timeout: 500,
          message: this.$i18n('needRefresh')
        })
      }
    },
    mounted () {
      const that = this
      browser.storage.sync.get(['enable']).then((result) => {
        // init enable value to true
        if (result.enable === undefined) {
          that.enable = true
          browser.storage.sync.set({ enable: true })
        } else {
          that.enable = result.enable
        }
      })
    },
    watch: {
      enable () {
        browser.storage.sync.set({ enable: this.enable })
      }
    }
  }
  </script>
  
  <style>
  html, body {
    width: 300px !important;
    height: 300px;
  }
  </style>
  
<template>
  <div class="fullscreen row text-center q-pa-md flex flex-center">
    {{ $i18n('extensionName') }}
    <q-toggle size="150px" v-model="enable" v-if="enable !== null" @input="change"/>
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
export default {
  name: 'Error404',
  data() {
    return {
      enable: null
    }
  },
  methods: {
    goOptions() {
      chrome.tabs.create({
        url: chrome.extension.getURL('www/index.html')
      }, (/* newTab */) => {
        // Tab opened.
      })
    },
    change(val) {
        this.$q.notify({
          position: 'top',
          timeout: 500,
          message: this.$i18n('needRefresh')
        })
    }
  },
  mounted() {
    let that = this;
    chrome.storage.sync.get(['enable'], function (result) {
      if (result.enable === undefined) {
        that.enable = true
        chrome.storage.sync.set({'enable': true})
      } else {
        that.enable = result.enable
      }
    })
  },
  watch: {
    enable() {
      console.log("set chrome options")
      chrome.storage.sync.set({"enable": this.enable})
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

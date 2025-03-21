<template>
<q-page class="flex flex-center">
  <div class="q-pa-md">
    <q-table
      :title="this.$i18n('allEnvs')"
      :rows="envs"
      :columns="columns"
      row-key="index"
       :hide-pagination="true"
        :pagination="pagination"
    >
    <template v-slot:top-right>
          <input
            ref="jsonUploader"
            type="file"
            hidden
            accept="application/json"
            @change="uploadJsonChange"
          />
          <q-btn
            style="margin-right: 10px"
            icon-right="unarchive"
            :label="this.$i18n('importJSON')"
            no-caps
            @click="importJson"
          />

          <q-btn icon-right="archive" :label="this.$i18n('exportJSON')" no-caps @click="exportJson" />
        </template>

        <template v-slot:body-cell-envBackgroundColor="props">
          <q-td :props="props">
            <q-avatar size="24px" :style="{ backgroundColor: props.value }"></q-avatar>
          </q-td>
        </template>
        <template v-slot:body-cell-textColor="props">
          <q-td :props="props">
            <q-avatar size="24px" :style="{ backgroundColor: props.value }"></q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-shape="props">
          <q-td :props="props">{{ this.$i18n(props.value) }}</q-td>
        </template>

        <template v-slot:body-cell-position="props">
          <q-td :props="props">{{ this.$i18n(props.value) }}</q-td>
        </template>

        <template v-slot:body-cell-operation="props">
          <q-td :props="props">
            <q-btn-group rounded>
              <q-btn
                icon="arrow_upward"
                :disable="props.rowIndex === 0"
                @click="up(props)"
                size="sm"
              />
              <q-btn
                icon="arrow_downward"
                :disable="props.rowIndex === envs.length - 1"
                @click="down(props)"
                size="sm"
              />
              <q-btn icon="edit" color="primary" @click="edit(props)" size="sm" />
              <q-btn icon="delete" color="red-5" @click="deleteEnv(props)" size="sm" />
            </q-btn-group>
          </q-td>
        </template>

    <template v-slot:body-cell-index="props">
          <q-td :props="props">{{ props.rowIndex }}</q-td>
        </template>
    </q-table>
    
  </div>

  <q-dialog v-model="formShow" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ this.$i18n("addEnv") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="form.envName"
              :label="this.$i18n('envName')"
              lazy-rules
              :rules="[val => val && val.length > 0 || this.$i18n('envNameRequired')]"
            />

            <q-input
              filled
              v-model="form.envBackgroundColor"
              :rules="['anyColor']"
              :label="this.$i18n('envBackgroundColor')"
            >
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-color v-model="form.envBackgroundColor" />
                  </q-popup-proxy>
                </q-icon>
                <q-avatar size="24px" :style="{ backgroundColor: form.envBackgroundColor }"></q-avatar>
              </template>
            </q-input>

            <q-input
              filled
              v-model="form.textColor"
              :rules="['anyColor']"
              :label="this.$i18n('textColor')"
            >
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-color v-model="form.textColor" />
                  </q-popup-proxy>
                </q-icon>
                <q-avatar size="24px" :style="{ backgroundColor: form.textColor }"></q-avatar>
              </template>
            </q-input>

            <q-select
              filled
              v-model="form.ruleType"
              :options="ruleTypeOptions"
              :label="this.$i18n('ruleType')"
              emit-value
              map-options
            />

            <q-input
              filled
              v-model="form.ruleValue"
              :label="this.$i18n('ruleValue')"
              lazy-rules
              :rules="[val => val && val.length > 0 || this.$i18n('ruleValueRequired')]"
            />

            <q-select
              filled
              v-model="form.shape"
              :options="shapeOptions"
              :label="this.$i18n('shape')"
              emit-value
              map-options
            />

            <q-select
              filled
              v-model="form.position"
              :options="positionOptions"
              :label="this.$i18n('position')"
              emit-value
              map-options
            />

            <div>
              <q-btn label="Save" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="importConfirm" persistent>
      i18n
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">{{ this.$i18n('importWarning') }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="this.$i18n('cancel')" color="secondary" v-close-popup />
          <q-btn flat :label="this.$i18n('merge')" color="primary" @click="mergeImport" />
          <q-btn flat :label="this.$i18n('overwrite')" color="primary" @click="overwriteImport" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="addEnv" />
    </q-page-sticky>
</q-page>
</template>

<script>
import defaultEnvs from '../assets/defaultEnvs.json'
import  browser from 'webextension-polyfill'
import { extend } from 'quasar'
import { toRaw } from 'vue'; // what happend to vue3...

function downloadTextFile (text, name) {
  const a = document.createElement('a')
  const type = name.split('.').pop()
  a.href = URL.createObjectURL(new Blob([text], { type: `text/${type === 'txt' ? 'plain' : type}` }))
  a.download = name
  a.click()
}

export default {
  data() {
    return {
      pagination: {
        rowsPerPage: -1 // current rows per page being displayed
      },
      columns: [
      {
          name: 'index',
          required: true,
          label: this.$i18n('order'),
          align: 'center',
          field: 'index'
        },
        {
          name: 'envName',
          required: true,
          label: this.$i18n('envName'),
          align: 'center',
          field: row => row.envName,
          format: val => `${val}`
        },
        {
          name: 'ruleType',
          align: 'center',
          label: this.$i18n('ruleType'),
          field: 'ruleType',
          format: val => this.$i18n(val)
        },
        {
          name: 'ruleValue',
          align: 'center',
          label: this.$i18n('ruleValue'),
          field: 'ruleValue'
        },
        {
          name: 'envBackgroundColor',
          align: 'center',
          label: this.$i18n('envBackgroundColor'),
          field: 'envBackgroundColor'
        },
        {
          name: 'textColor',
          align: 'center',
          label: this.$i18n('textColor'),
          field: 'textColor'
        },
        {
          name: 'shape',
          align: 'center',
          label: this.$i18n('shape'),
          field: 'shape'
        },
        {
          name: 'position',
          align: 'center',
          label: this.$i18n('position'),
          field: 'position'
        },
        {
          name: 'operation',
          align: 'center',
          label: this.$i18n('operation'),
          field: 'operation'
        }
      ], 
      envs: [],
      // current editing row index, if null then create;
      editRowIndex: null,
      form: {
        envName: null,
        envBackgroundColor: '#00a300',
        textColor: '#FFFFFF',
        ruleType: 'contains',
        ruleValue: '',
        position: 'left',
        shape: 'ribbon'
      },

      ruleTypeOptions: [
        {
          label: this.$i18n('contains'),
          value: 'contains'
        },
        {
          label: this.$i18n('prefix'),
          value: 'prefix'
        },
        {
          label: this.$i18n('suffix'),
          value: 'suffix'
        },
        {
          label: this.$i18n('regex'),
          value: 'regex'
        }
      ],

      positionOptions: [
        {
          label: this.$i18n('left'),
          value: 'left'
        },
        {
          label: this.$i18n('right'),
          value: 'right'
        },
        {
          label: this.$i18n('left_bottom'),
          value: 'left_bottom'
        },
        {
          label: this.$i18n('right_bottom'),
          value: 'right_bottom'
        }
      ],

      shapeOptions: [{
        label: this.$i18n('ribbon'),
        value: 'ribbon'
      }, {
        label: this.$i18n('triangle'),
        value: 'triangle'
      }],

      accept: false,
      formShow: false,
      importConfirm: false,
      importData: {}

    }
  },
  mounted () {
    const that = this
    browser.storage.sync.get(['envs']).then((result) => {
      that.envs = result.envs
      console.log('rules currently is ', result.envs)
      if (result.envs === undefined) {
        that.envs = defaultEnvs
        browser.storage.sync.set({ envs: defaultEnvs })
      }
    })
  },
  methods: {
    onSubmit () {
      if (this.editRowIndex !== null) {
        this.envs[this.editRowIndex] = extend(true, {}, this.form)
        console.log('editRowIndex', this.editRowIndex, "after edit env=", this.envs)
      } else {
        this.envs.push(extend(true, {}, this.form))
      }
      const that = this
      browser.storage.sync.set({ envs: toRaw(that.envs) }).then(() => {
        console.log('envs is set to ', that.envs) 
      })
      // reset editing status
      this.editRowIndex = null
      this.formShow = false
    },
    onReset () {
      this.form.envName = null
      this.form.ruleType = 'contains'
      this.form.envBackgroundColor = '#00a300'
      this.form.ruleValue = ''
      this.form.position = 'left'
      this.form.textColor = '#FFFFFF'
      this.form.shape = 'ribbon'
    },
    addEnv () {
      this.editRowIndex = null
      this.onReset()
      this.formShow = true
    },
    edit (props) {
      console.log('editing row: ', props.rowIndex, props.row)
      this.editRowIndex = props.rowIndex
      this.form = extend(true, {}, props.row)
      this.formShow = true
    },
    deleteEnv (props) {
      this.envs.splice(props.rowIndex, 1)
      browser.storage.sync.set({ envs: toRaw(this.envs) }).then(() => {
        console.log('envs is set to ' + this.envs)
      })
    },
    up (props) {
      const tmp = this.envs[props.rowIndex - 1]

      this.envs[props.rowIndex - 1] = this.envs[props.rowIndex]
      this.envs[props.rowIndex] =  tmp
      browser.storage.sync.set({ envs: toRaw(this.envs) }).then(() => {
        console.log('envs is set to ' + this.envs)
      })
    },
    down (props) {
      const tmp = this.envs[props.rowIndex + 1]
      this.envs[props.rowIndex + 1] = this.envs[props.rowIndex]
      this.envs[props.rowIndex] = tmp

      browser.storage.sync.set({ envs: toRaw(this.envs) }).then(() => {
        console.log('envs is set to ' + this.envs)
      })
    },

    importJson () {
      this.$refs.jsonUploader.click()
    },
    uploadJsonChange () {
      const that = this
      const reader = new FileReader()
      reader.onload = function fileReadCompleted () {
        that.importData = JSON.parse(reader.result)
        that.importConfirm = true
        // clear
        that.$refs.jsonUploader.value = null
      }
      reader.readAsText(this.$refs.jsonUploader.files[0])
    },
    exportJson () {
      browser.storage.sync.get(['envs']).then((result) => {
        downloadTextFile(JSON.stringify(result.envs), 'env-indicator-export.json')
      }
      )
    },
    mergeImport () {
      this.envs = this.envs.concat(this.importData)
      browser.storage.sync.set({ envs: toRaw(this.envs) })
      this.importConfirm = false
    },
    overwriteImport () {
      this.envs = this.importData
      browser.storage.sync.set({ envs: toRaw(this.envs) })
      this.importConfirm = false
    }
  }
}
</script>
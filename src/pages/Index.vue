<template>
  <q-page class="flex flex-center">

    <div class="q-pa-md">
      <q-table
        :title="this.$i18n('allEnvs')"
        :data="envs"
        :columns="columns"
        row-key="index"
        :hide-pagination="true"
        :pagination="pagination"
      >
        <template v-slot:body-cell-index="props">
          <q-td :props="props">
            {{ props.rowIndex }}
          </q-td>
        </template>
        <template v-slot:body-cell-envBackgroundColor="props">
          <q-td :props="props">
            <q-avatar size="24px" :style="{ backgroundColor: props.value }"></q-avatar>
          </q-td>
        </template>
        <template v-slot:body-cell-operation="props">
          <q-td :props="props">
            <q-btn-group rounded>
              <q-btn icon="arrow_upward" :disable="props.rowIndex === 0" @click="up(props)" size="sm"/>
              <q-btn icon="arrow_downward" :disable="props.rowIndex === envs.length - 1" @click="down(props)"
                     size="sm"/>
              <q-btn icon="edit" color="primary" @click="edit(props)" size="sm"/>
              <q-btn icon="delete" color="red-5" @click="deleteEnv(props)" size="sm"/>
            </q-btn-group>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="formShow" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $i18n("addEnv") }}</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section>

          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="form.envName"
              :label="this.$i18n('envName')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || this.$i18n('envNameRequired')]"
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
                    <q-color v-model="form.envBackgroundColor"/>
                  </q-popup-proxy>
                </q-icon>
                <q-avatar size="24px" :style="{ backgroundColor: form.envBackgroundColor }"></q-avatar>

              </template>
            </q-input>

            <q-select filled v-model="form.ruleType" :options="ruleTypeOptions" :label="this.$i18n('ruleType')"
                      emit-value map-options/>

            <q-select filled v-model="form.position" :options="positionOptions" :label="this.$i18n('position')"
                      emit-value map-options/>

            <q-input
              filled
              v-model="form.ruleValue"
              :label="this.$i18n('ruleValue')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || this.$i18n('ruleValueRequired')]"
            />

            <div>
              <q-btn label="Save" type="submit" color="primary"/>
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="addEnv"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import {extend} from 'quasar'

export default {
  name: 'PageIndex',
  data() {
    return {
      pagination: {
        rowsPerPage: -1 // current rows per page being displayed
      },
      // all envs stored
      envs: [],
      // current editing row index, if null then create;
      editRowIndex: null,
      form: {
        envName: null,
        envBackgroundColor: '#00a300',
        ruleType: 'contains',
        ruleValue: '',
        position: 'left',
      },

      ruleTypeOptions: [
        {
          label: this.$i18n('contains'),
          value: 'contains',
        },
        {
          label: this.$i18n('prefix'),
          value: 'prefix',
        },
        {
          label: this.$i18n('suffix'),
          value: 'suffix',
        },
        {
          label: this.$i18n('regex'),
          value: 'regex',
        },
      ],

      positionOptions: [
        {
          label: this.$i18n('left'),
          value: 'left',
        },
        {
          label: this.$i18n('right'),
          value: 'right',
        },
      ],

      accept: false,
      formShow: false,
      columns: [
        {
          name: 'index',
          required: true,
          label: this.$i18n('order'),
          align: 'center',
          field: 'index',
        },
        {
          name: 'envName',
          required: true,
          label: this.$i18n('envName'),
          align: 'center',
          field: row => row.envName,
          format: val => `${val}`,
        },
        {
          name: 'ruleType',
          align: 'center',
          label: this.$i18n('ruleType'),
          field: 'ruleType',
          format: val => this.$i18n(val),
        },
        {
          name: 'ruleValue',
          align: 'center',
          label: this.$i18n('ruleValue'),
          field: 'ruleValue',
        },
        {
          name: 'envBackgroundColor',
          align: 'center',
          label: this.$i18n('envBackgroundColor'),
          field: 'envBackgroundColor',
        },
        {
          name: 'position',
          align: 'center',
          label: this.$i18n('position'),
          field: 'position',
        },
        {
          name: 'operation',
          align: 'center',
          label: this.$i18n('operation'),
          field: 'operation'
        },
      ],
    }
  },
  methods: {
    onSubmit() {
      if (this.editRowIndex !== null) {
        this.$set(this.envs, this.editRowIndex, extend(true, {}, this.form))
        console.log("editRowIndex", this.editRowIndex)
      } else {
        this.envs.push(extend(true, {}, this.form))
      }
      let that = this
      chrome.storage.sync.set({"envs": this.envs}, function () {
        console.log('envs is set to ', that.envs);
      });
      // reset editing status
      this.editRowIndex = null;
      this.formShow = false;
    },
    onReset() {
      this.form.envName = null
      this.form.ruleType = 'contains'
      this.form.envBackgroundColor = '#00a300'
      this.form.ruleValue = ''
      this.form.position = 'left'
    },
    addEnv() {
      this.editRowIndex = null;
      this.onReset();
      this.formShow = true
    },
    edit(props) {
      console.log('editing row: ', props.rowIndex, props.row)
      this.editRowIndex = props.rowIndex
      this.form = extend(true, {}, props.row);
      this.formShow = true;
    },
    deleteEnv(props) {
      this.envs.splice(props.rowIndex, 1);
      chrome.storage.sync.set({"envs": this.envs}, function () {
        console.log('envs is set to ' + this.envs);
      });
    },
    up(props) {
      let tmp = this.envs[props.rowIndex - 1];
      this.$set(this.envs, props.rowIndex - 1, this.envs[props.rowIndex]);
      this.$set(this.envs, props.rowIndex, tmp);
      chrome.storage.sync.set({"envs": this.envs}, function () {
        console.log('envs is set to ' + this.envs);
      });
    },
    down(props) {
      let tmp = this.envs[props.rowIndex + 1];
      this.$set(this.envs, props.rowIndex + 1, this.envs[props.rowIndex]);
      this.$set(this.envs, props.rowIndex, tmp);

      chrome.storage.sync.set({"envs": this.envs}, function () {
        console.log('envs is set to ' + this.envs);
      });
    },
  },
  mounted() {
    let that = this
    chrome.storage.sync.get(['envs'], function (result) {
      that.envs = result.envs
      console.log('rules currently is ', result.envs);

      // put init data
      if (result.envs === undefined) {
        that.envs = []
        chrome.storage.sync.set({'envs': []})
      }
    });
  }
}
</script>

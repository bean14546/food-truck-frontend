<template>
  <v-dialog
    v-model="dialog"
    persistent
    :width="width"
  >
    <v-card class="rounded-lg">
      <v-card-title v-if="!hideHeader" class="pa-5 pa-sm-6">
        <span class="text-subtitle-1 text-md-h5 primary--text">{{ modalName }}</span>
        <v-spacer />
        <v-card-actions class="pa-0">
          <v-btn
            elevation="0"
            @click="close"
          >
          <span class="font-weight-regular"> {{ nameCancelBtn }} </span>
          </v-btn>
          <v-btn
            v-if="hideSaveBtn"
            color="primary"
            elevation="0"
            :disabled="btnDisable"
            @click="save"
          >
            <span class="font-weight-regular"> {{ nameSaveBtn }} </span>
          </v-btn>
        </v-card-actions>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-5 pa-sm-6">
        <slot name="body" />
      </v-card-text>
      <v-card-actions v-if="footer" :class="`justify-center ${footerColor}`">
        <slot name="footer" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseModalComponent',
  props: {
    modalName: {
      default: 'ชื่อ Modal',
      type: String
    },
    nameSaveBtn: {
      default: 'บันทึก',
      type: String
    },
    nameCancelBtn: {
      default: 'ยกเลิก',
      type: String
    },
    width: {
      default: '500px',
      type: [String, Number]
    },
    hideHeader: {
      default: false,
      type: Boolean
    },
    footer: {
      default: false,
      type: Boolean
    },
    footerColor : {
      default: '',
      type: String
    },
    btnDisable : {
      default: false,
      type: Boolean
    },
    hideSaveBtn: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    show () {
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.$emit('close')
    },
    confirm () {
      this.$emit('confirm')
    },
    save () {
      this.$emit('save')
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
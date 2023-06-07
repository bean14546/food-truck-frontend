<template>
  <div>
    <baseModal ref="baseModal" modal-name="ยืนยันการลบ" :width="400" hide-header footer @confirm="confirm">
      <template #body>
        <div class="text-center">
          <v-icon size="120" :color="iconColor">
            {{ icon }}
          </v-icon>
          <p class="text-h6 font-weight-bold mb-0">{{ text }}</p>
        </div>
      </template>
      <template #footer>
        <div class="pb-5">
          <v-btn
            class="mr-2"
            elevation="0"
            @click="close"
          >
            <span class="font-weight-regular"> ยกเลิก </span>
          </v-btn>
          <v-btn
            class="ml-2"
            color="primary"
            elevation="0"
            @click="confirm"
          >
            <span class="font-weight-regular"> ยืนยัน </span>
          </v-btn>
        </div>
      </template>
    </baseModal>
  </div>
</template>

<script>
import baseModal from '@/components/backend/modal/base.vue'
export default {
  name: 'ConfirmModalComponent',
  components: { baseModal },
  props: {
    icon: {
      default: 'mdi-alert',
      type: String
    },
    iconColor: {
      default: 'primary',
      type: String
    }
  },
  data () {
    return {
      promise: null,
      itemData: null,
      text: ''
    }
  },
  methods: {
    show (itemData, text) {
      this.$refs.baseModal.show()
      this.text = text
      this.itemData = itemData
      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    confirm () {
      this.promise.resolve(this.itemData)
      this.$refs.baseModal.close()
    },
    close () {
      this.$refs.baseModal.close()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
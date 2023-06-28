<template>
  <baseModal
    ref="baseModal"
    :modal-name="modalName"
    @close="clearModal"
    @save="validate"
  >
    <template #body>
      <v-text-field v-model="reason" label="เหตุผลการยกเลิก" placeholder="เหตุผลการยกเลิก" />
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base'
export default {
  name: 'CancelOrderModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      reason: '',
      promise: null
    }
  },
  computed: {
    modalName () {
      return 'เลือกเวลาทำอาหาร'
    }
  },
  methods: {
    show () {
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      this.promise.resolve(this.reason)
      this.$refs.baseModal.close()
    },
    clearModal () {
      this.edit = false
      this.reason = ''
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
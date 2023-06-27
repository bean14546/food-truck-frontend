<template>
  <baseModal
    ref="baseModal"
    :name-save-btn="nameSaveBtn"
    :modal-name="modalName"
    :hide-save-btn="hideSaveBtn"
    @close="clearModal"
    @save="validate"
  >
    <template #body>
      <detailCardComponent ref="detailCardComponent" :items="item" />
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base'
import detailCardComponent from '@/components/card/detailCard'
export default {
  name: 'CheckOrderModalComponent',
  components: {
    baseModal,
    detailCardComponent
  },
  data () {
    return {
      item: null,
      promise: null
    }
  },
  computed: {
    modalName () {
      return 'รายการ Order'
    },
    nameSaveBtn () {
      return this.item && this.item.order_list_status_id === 1 ? 'รับออเดอร์' : 'เสร็จสิ้น'
    },
    hideSaveBtn () {
      return (this.item && this.item.order_list_status_id !== 3) && (this.item && this.item.order_list_status_id !== 4)
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.item = data
      }
      this.$refs.baseModal.show()
      this.$nextTick(() => {
        this.$refs.detailCardComponent.getCountdownTimer()
      })
      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      this.promise.resolve(this.item)
      this.$refs.baseModal.close()
    },
    clearModal () {
      this.item = null
      this.$nextTick(() => {
        this.$refs.detailCardComponent.clearCountdownTimer()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
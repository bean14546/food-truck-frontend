<template>
  <baseModal
    ref="baseModal"
    nameSaveBtn="รับออเดอร์"
    :modal-name="modalName"
    @close="clearModal"
    @save="validate"
  >
    <template #body>
      <detailCardComponent :items="item" />
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
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.item = data
      }
      this.$refs.baseModal.show()

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
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
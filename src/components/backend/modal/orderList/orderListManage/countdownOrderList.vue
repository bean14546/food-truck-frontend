<template>
  <baseModal
    ref="baseModal"
    :modal-name="modalName"
    @close="clearModal"
    @save="validate"
  >
    <template #body>
      <v-btn-toggle v-model="timeId" class="d-flex" color="transparent" active-class="primary white--text" mandatory>
        <v-row v-if="items && items.length > 0">
          <v-col v-for="(item, index) in items" :key="`order-list-${index}`" cols="12" md="6">
            <v-btn outlined block :value="item.id">{{ item.time }} นาที</v-btn>
          </v-col>
        </v-row>
      </v-btn-toggle>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base'
export default {
  name: 'CountdownOrderModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      items: [],
      timeId: null,
      promise: null
    }
  },
  computed: {
    modalName () {
      return 'เลือกเวลาทำอาหาร'
    }
  },
  methods: {
    show (data) {
      this.items = data
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      const timeId = this.timeId
      this.promise.resolve(timeId)
      this.$refs.baseModal.close()
    },
    clearModal () {
      this.edit = false
      this.items = null
      this.timeId = null
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
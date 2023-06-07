<template>
  <baseModal
    ref="baseModal"
    :modal-name="modalName"
    @close="clearModal"
    @save="validate"
  >
    <template #body>
      <v-form @submit.prevent="validate" ref="form">
        <v-row>
          <v-col cols="12" class="px-3 py-1">
            <v-text-field v-model="countdownObj.time" :rules="countdownRules" label="เวลาทำอาหาร" placeholder="ระบุเวลาทำอาหาร(นาที) เช่น 5 เป็นต้น" />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base.vue'
export default {
  name: 'OrderStatusModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      countdownRules: [ value => !!value || 'Required.' ],
      countdownObj: { time: '' },
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }เวลาทำอาหาร`
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.countdownObj = { time: data.time }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const countdownObj = { time: this.countdownObj.time }
        this.promise.resolve(countdownObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.countdownObj.time = ''
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
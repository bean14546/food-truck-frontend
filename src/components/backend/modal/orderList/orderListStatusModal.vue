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
            <v-text-field v-model="orderStatusObj.Order_List_Status_Name" :rules="orderStatusRules" label="สถานะของออเดอร์" placeholder="ระบุสถานะของออเดอร์ เช่น รอดำเนินการ เป็นต้น" />
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
      orderStatusRules: [ value => !!value || 'Required.' ],
      orderStatusObj: { Order_List_Status_Name: '' },
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }สถานะของออร์เดอร์`
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.orderStatusObj = { Order_List_Status_Name: data.Order_List_Status_Name }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const orderStatusObj = { Order_List_Status_Name: this.orderStatusObj.Order_List_Status_Name }
        this.promise.resolve(orderStatusObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.orderStatusObj.Order_List_Status_Name = ''
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
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
            <v-text-field v-model="unitObj.unit" :rules="unitRules" label="หน่วย" placeholder="ระบุหน่วยของวัตถุดิบ เช่น กรัม เป็นต้น" />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base.vue'
export default {
  name: 'UnitModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      unitRules: [ value => !!value || 'Required.' ],
      unitObj: { unit: '' },
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }หน่วยของวัตถุดิบ`
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.unitObj = { unit: data.unit }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const unitObj = { unit: this.unitObj.unit }
        this.promise.resolve(unitObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.unitObj.unit = ''
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
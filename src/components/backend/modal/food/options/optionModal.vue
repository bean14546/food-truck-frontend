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
            <v-text-field v-model="optionObj.Option_Name" :rules="optionRules" label="Option" placeholder="ระบุ Option ของวัตถุดิบ เช่น เนื้อ เป็นต้น" />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base.vue'
export default {
  name: 'OptionModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      optionRules: [ value => !!value || 'Required.' ],
      optionObj: { Option_Name: '' },
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' } Option ของวัตถุดิบ`
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.optionObj = { Option_Name: data.Option_Name }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const optionObj = { Option_Name: this.optionObj.Option_Name }
        this.promise.resolve(optionObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.optionObj.Option_Name = ''
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
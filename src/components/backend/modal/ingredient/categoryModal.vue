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
            <v-text-field v-model="categoryObj.ingredientGroup" :rules="categoryRules" label="หมวดหมู่" placeholder="ระบุหมวดหมู่ของวัตถุดิบ เช่น วัตถุดิบสำหรับทำของหวาน เป็นต้น" />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base.vue'
export default {
  name: 'CategoryModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      categoryRules: [ value => !!value || 'Required.' ],
      categoryObj: { ingredientGroup: '' },
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }หมวดหมู่ของวัตถุดิบ`
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.categoryObj = { ingredientGroup: data.ingredientGroup }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const categoryObj = { ingredientGroup: this.categoryObj.ingredientGroup }
        this.promise.resolve(categoryObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.categoryObj.ingredientGroup = ''
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
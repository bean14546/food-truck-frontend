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
            <v-text-field v-model="toppingObj.Topping_Name" :rules="toppingRules.Topping_Name" label="Topping" placeholder="ระบุ Topping ของวัตถุดิบ เช่น ไข่ดาว เป็นต้น" />
          </v-col>
          <v-col cols="12" sm="6" class="px-3 py-1">
            <v-text-field v-model.number="toppingObj.Topping_Price" :rules="toppingRules.Topping_Price" label="ราคา" placeholder="ระบุราคา เช่น 100 เป็นต้น" />
          </v-col>
          <v-col cols="12" sm="6" class="px-3 py-1">
            <v-autocomplete
              v-model.number="toppingObj.isActive"
              :rules="toppingRules.isActive"
              :items="isActive"
              item-text="name"
              item-value="status"
              label="สถานะ"
              placeholder="เลือกสถานะ"
              required
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base'
export default {
  name: 'ToppingModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      toppingRules: {
        Topping_Name: [ value => !!value || 'Required.' ],
        Topping_Price: [ value => !!value || 'Required.' ]
      },
      toppingObj: {
        Topping_Name: '',
        Topping_Price: 0,
        isActive: 1
      },
      isActive: [{ status: 0, name: 'ปิด' }, { status: 1, name: 'เปิด' }],
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' } Topping`
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.toppingObj = {
          Topping_Name: data.Topping_Name,
          Topping_Price: data.Topping_Price,
          isActive: data.isActive
        }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const toppingObj = {
          Topping_Name: this.toppingObj.Topping_Name,
          Topping_Price: Number(this.toppingObj.Topping_Price),
          isActive: Number(this.toppingObj.isActive)
        }
        this.promise.resolve(toppingObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.toppingObj.Topping_Name = ''
      this.toppingObj.Topping_Price = 0
      this.toppingObj.isActive = 1
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
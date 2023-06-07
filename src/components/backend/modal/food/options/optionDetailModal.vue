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
            <v-text-field v-model="optionDetailObj.Option_Detail_Name" :rules="optionDetailRules.Option_Name" label="รายละเอียด Option" placeholder="ระบุรายละเอียด Option ของวัตถุดิบ เช่น หมู ไก่ เป็นต้น" />
          </v-col>
          <v-col cols="12" sm="6" class="px-3 py-1">
            <v-text-field v-model.number="optionDetailObj.Option_Detail_Price" :rules="optionDetailRules.Option_Detail_Price" label="ราคา" placeholder="ระบุราคา เช่น 100 เป็นต้น" type="number" hide-spin-buttons />
          </v-col>
          <v-col cols="12" sm="6" class="px-3 py-1">
            <v-autocomplete
              v-model.number="optionDetailObj.isActive"
              :rules="optionDetailRules.isActive"
              :items="isActive"
              item-text="name"
              item-value="status"
              label="สถานะ"
              placeholder="เลือกสถานะ"
              required
            />
          </v-col>
          <v-col cols="12" class="px-3 py-1">
            <v-autocomplete
              v-model.number="optionDetailObj.option_id"
              :rules="optionDetailRules.option_id"
              :items="option"
              item-text="Option_Name"
              item-value="id"
              label="Option"
              placeholder="เลือก Option"
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
import optionApi from '@/api/optionApi'
export default {
  name: 'OptionDetailModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      optionDetailRules: {
        Option_Detail_Name: [ value => !!value || 'Required.' ],
        Option_Detail_Price: [ value => value >= 0 || 'Value must be greater than or equal to 0.' ],
        isActive: [ value => !!value || 'Required.' ],
        option_id: [ value => !!value || 'Required.' ]
      },
      optionDetailObj: {
        Option_Detail_Name: '',
        Option_Detail_Price: 0,
        isActive: 1,
        option_id: null
      },
      option: [],
      isActive: [{ status: 0, name: 'ปิด' }, { status: 1, name: 'เปิด' }],
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }รายละเอียด Option`
    }
  },
  mounted () {
    optionApi.getAll().then((res) => {
      this.option = res.data
    })
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.optionDetailObj = {
          Option_Detail_Name: data.Option_Detail_Name,
          Option_Detail_Price: data.Option_Detail_Price,
          isActive: Number(data.isActive),
          option_id: data.option_id
        }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const optionDetailObj = {
          Option_Detail_Name: this.optionDetailObj.Option_Detail_Name,
          Option_Detail_Price: Number(this.optionDetailObj.Option_Detail_Price),
          isActive: this.optionDetailObj.isActive,
          option_id: this.optionDetailObj.option_id
        }
        this.promise.resolve(optionDetailObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.optionDetailObj.Option_Detail_Name = ''
      this.optionDetailObj.Option_Detail_Price = 0
      this.optionDetailObj.isActive = 1
      this.optionDetailObj.option_id = null
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
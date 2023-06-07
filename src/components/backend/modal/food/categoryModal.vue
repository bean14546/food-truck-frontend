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
          <v-col cols="12">
            <upload @file="addImage" ref="upload" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="categoryObj.Category_Name" label="หมวดหมู่" placeholder="ชื่อหมวดหมู่อาหาร เช่น อาหารคาว เป็นต้น" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="categoryObj.Category_Description"
              label="คำอธิบายหมวดหมู่"
              placeholder="คำอธิบายหมวดหมู่ เช่น อาหารประเภทของคาว เป็นต้น"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base'
import upload from '@/components/backend/upload'
export default {
  name: 'categoryComponent',
  components: {
    baseModal,
    upload
  },
  data () {
    return {
      edit: false,
      categoryRules: {
        Category_Image: [ value => !!value || 'Required.' ],
        Category_Name: [ value => !!value || 'Required.' ],
        Category_Description: [ value => !!value || 'Required.' ]
      },
      categoryObj: {
        Category_Image: '',
        Category_Name: '',
        Category_Description: ''
      },
      category: [],
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }หมวดหมู่อาหาร`
    }
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.categoryObj = {
          Category_Image: data.Category_Image,
          Category_Name: data.Category_Name,
          Category_Description: data.Category_Description
        }
        this.$nextTick(() => {
          this.$refs.upload.imgForEdit(this.categoryObj.Category_Image)
        })
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    addImage (file) {
      this.categoryObj.Category_Image = file
    },
    validate () {
      if (this.$refs.form.validate()) {
        const categoryObj = {
          Category_Image: this.categoryObj.Category_Image,
          Category_Name: this.categoryObj.Category_Name,
          Category_Description: this.categoryObj.Category_Description
        }

        const data = new FormData()
        data.append('Category_Image', categoryObj.Category_Image)
        data.append('Category_Name', categoryObj.Category_Name)
        data.append('Category_Description', categoryObj.Category_Description)

        this.promise.resolve(data)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.categoryObj.Category_Image = ''
      this.categoryObj.Category_Name = ''
      this.categoryObj.Category_Description = ''
      this.edit = false
      this.$refs.upload.clearData()
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
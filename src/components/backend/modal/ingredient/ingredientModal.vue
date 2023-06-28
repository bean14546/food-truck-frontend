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
            <v-text-field v-model="ingredientObj.ingredient" :rules="ingredientObjRules.ingredient" label="ชื่อวัตถุดิบ" placeholder="ระบุชื่อวัตถุดิบ เช่น ใบกะเพรา เป็นต้น" />
          </v-col>
          <v-col cols="12" sm="6" class="px-3 py-1">
            <v-autocomplete
              v-model.number="ingredientObj.ingredient_group_id"
              :rules="ingredientObjRules.ingredientGroup"
              :items="ingredientGroup"
              item-text="ingredientGroup"
              item-value="id"
              label="หมวดหมู่"
              placeholder="เลือกหมวดหมู่"
              required
            />
          </v-col>
          <v-col cols="12" sm="6" class="px-3 py-1">
            <v-autocomplete
              v-model.number="ingredientObj.ingredient_unit_id"
              :rules="ingredientObjRules.ingredientUnit"
              :items="ingredientUnit"
              item-text="unit"
              item-value="id"
              label="หน่วย"
              placeholder="เลือกหน่วย"
              required
            />
          </v-col>
          <v-col cols="12" class="px-3 py-1">
            <v-text-field v-model.number="ingredientObj.cost" :rules="ingredientObjRules.cost" label="ต้นทุน" placeholder="ระบุต้นทุนต่อ 1 หน่วย เช่น 100 เป็นต้น" />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base.vue'
import ingredientGroupApi from '@/api/ingredientGroupApi'
import ingredientUnitApi from '@/api/ingredientUnitApi'
export default {
  name: 'IngredientModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      ingredientGroup: [],
      ingredientUnit: [],
      ingredientObjRules: {
        ingredient: [ value => !!value || 'Required.' ],
        cost: [ value => !!value || 'Required.' ],
        ingredientGroup: [ value => !!value || 'Required.' ],
        ingredientUnit: [ value => !!value || 'Required.' ]
      },
      ingredientObj: {
        ingredient: '',
        cost: null,
        stock_id: null,
        ingredient_group_id: null,
        ingredient_unit_id: null
      },
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }รายการวัตถุดิบ`
    }
  },
  mounted () {
    ingredientGroupApi.getAll().then((res) => {
      this.ingredientGroup = res.data
    })
    ingredientUnitApi.getAll().then((res) => {
      this.ingredientUnit = res.data
    })
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.ingredientObj = {
          ingredient: data.ingredient,
          cost: data.cost,
          stock_id: data.stock.stock_id,
          ingredient_group_id: data.ingredientGroup.ingredient_group_id,
          ingredient_unit_id: data.ingredientUnit.ingredient_unit_id
        }
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      if (this.$refs.form.validate()) {
        const ingredientObj = {
          ingredient: this.ingredientObj.ingredient,
          cost: this.ingredientObj.cost,
          stock_id: this.ingredientObj.stock_id,
          ingredient_group_id: this.ingredientObj.ingredient_group_id,
          ingredient_unit_id: this.ingredientObj.ingredient_unit_id
        }
        this.promise.resolve(ingredientObj)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.ingredientObj.ingredient = '',
      this.ingredientObj.cost = null,
      this.ingredientObj.stock_id = 0,
      this.ingredientObj.ingredient_group_id = null,
      this.ingredientObj.ingredient_unit_id = null
      this.edit = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
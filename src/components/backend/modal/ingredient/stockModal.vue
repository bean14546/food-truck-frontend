<template>
  <baseModal
    ref="baseModal"
    :modal-name="modalName"
    width="800px"
    :btn-disable="!(itemsForSave && itemsForSave.length > 0)"
    :hide-save-btn="!edit"
    footer
    @close="clearModal"
    @save="validate"
  >
    <template #body>
      <v-form v-if="!edit" @submit.prevent="validate" ref="form">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="ingredientObj.date" label="วันที่" placeholder="วันที่" prepend-icon="mdi-calendar" disabled />
          </v-col>
          <v-col class="align-self-center text-end">
            <v-btn color="secondary" elevation="0" @click="pushIngredientToItemForSave">
              <span class="primary--text"> เพิ่มวัตถุดิบ </span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-autocomplete v-model.number="ingredientObj.ingredient_id" :items="items" :rules="ingredientObjRules.ingredient" label="เลือกวัตถุดิบ" placeholder="เลือกวัตถุดิบ" item-text="ingredient" item-value="id" required @change="selectIngredient" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model.number="ingredientObj.cost" :rules="ingredientObjRules.cost" label="ต้นทุน" placeholder="ต้นทุน" disabled  />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="ingredientObj.ingredientGroup" :rules="ingredientObjRules.ingredientGroup" label="หมวดหมู่" placeholder="หมวดหมู่" disabled />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model.number="ingredientObj.quantity" :rules="ingredientObjRules.quantity" label="จำนวน" placeholder="จำนวนสต๊อกที่ต้องการเพิ่ม" @change="editQuantity" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="ingredientObj.unit" :rules="ingredientObjRules.unit" label="หน่วย" placeholder="หน่วย" disabled />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model.number="ingredientObj.total" :rules="ingredientObjRules.total" label="รวม" placeholder="รวม" disabled />
          </v-col>
        </v-row>
      </v-form>
      <!-- วัตถุดิบที่เพิ่มแล้ว -->
      <v-list v-if="itemsForSave && itemsForSave.length > 0">
        <v-list-item>
          <v-list-item-content>
            <v-layout class="d-flex justify-space-between">
              <v-flex
                v-for="(header, index) in headers"
                :key="`${header.title}-${index}`"
                tag="div"
                :style="`width: ${ header.width ? header.width : 'auto' }`"
                :class="`text-${header.align}`"
              >
                <span class="text-center mr-2" :class="header.truncate ? 'text-truncate' : ''">{{ header.text }}</span>
              </v-flex>
            </v-layout>
          </v-list-item-content>
        </v-list-item>
        <template v-if="(itemsForSave && itemsForSave.length > 0)">
          <div v-for="(item, itemIndex) in itemsForSave" :key="itemIndex" class="border">
            <v-list-item style="height: 48px">
              <v-list-item-content>
                <v-layout class="d-flex justify-space-between align-center grey--text text--darken-2">
                  <v-flex
                    v-for="(header, headerIndex) in headers"
                    class="items px-2 mb-0"
                    :key="headerIndex"
                    :class="`${header.truncate ? 'text-truncate': ''} ${aligns(header.align)}`"
                    :style="`width: ${ !header.width ? 'auto' : header.width }`"
                    tag="div"
                  >
                    <span v-if="header.value === 'index'">{{ itemIndex + 1 }}</span>
                    <span class="lineClamp">{{ item[header.value] }}</span>
                  </v-flex>
                </v-layout>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
          </div>
        </template>
      </v-list>
      <!-- <div v-else class="text-center">ไม่พบสต๊อกของวัตถุดิบ</div> -->
    </template>
  </baseModal>
</template>

<script>
import baseModal from '@/components/backend/modal/base.vue'
import ingredientApi from '@/api/ingredientApi/'
export default {
  name: 'stockModalComponent',
  components: {
    baseModal
  },
  data () {
    return {
      edit: false,
      headers: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'วัตถุดิบ', align: 'start', value: 'ingredient', width: '15%' },
        { text: 'ต้นทุน', align: 'center', value: 'cost', width: '10%' },
        { text: 'สต๊อก', align: 'center', value: 'quantity', width: '10%' },
        { text: 'หน่วย', align: 'center', value: 'unit', width: '10%' },
        { text: 'รวม', align: 'center', value: 'total', width: '15%' }
      ],
      ingredientObj: {
        ingredient_id: null,
        ingredient: null,
        cost: 0,
        quantity: 0,
        unit: '',
        ingredientGroup: '',
        total: 0,
        date: '',
        ingredient_group_id: 0,
        ingredient_unit_id: 0,
        stock_id: 0
      },
      ingredientObjRules: {
        ingredient: [value => !!value || 'Required.'],
        cost: [value => !!value || 'Required.'],
        quantity: [value => !!value || 'Required.', value => Number(value) > 0 || 'Must be greater than 0'],
        unit: [value => !!value || 'Required.'],
        ingredientGroup: [value => !!value || 'Required.'],
        total: [value => !!value || 'Required.']
      },
      items: [],
      itemsForSave: [],
      promise: null
    }
  },
  computed: {
    modalName () { return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }สต๊อกของวัตถุดิบ` }
  },
  mounted () {
    ingredientApi.getAll().then((res) => {
      this.items = res.data
      this.ingredientObj.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    })
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        const itemForSave = data.ingredient.map((item) => {
          const obj = {}
          obj.cost = item.cost
          obj.ingredient = item.ingredient
          obj.ingredient_id = item.ingredient_id
          obj.quantity = item.quantity
          obj.unit = item.unit
          obj.total = Number(item.cost) * Number(item.quantity)
          obj.stock_id = item.stock_id
          obj.date = item.date
          return obj
        })
        this.itemsForSave = itemForSave
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    selectIngredient () {
      ingredientApi.getOne(this.ingredientObj.ingredient_id).then((res) => {
        this.ingredientObj.cost = Number(res.data.cost)
        this.ingredientObj.ingredient = res.data.ingredient
        this.ingredientObj.quantity = Number(res.data.stock.quantity)
        this.ingredientObj.unit = res.data.ingredientUnit.unit
        this.ingredientObj.ingredientGroup = res.data.ingredientGroup.group
        this.ingredientObj.total = Number(res.data.cost) * Number(res.data.stock.quantity)
        this.ingredientObj.ingredient_group_id = res.data.ingredientGroup.ingredient_group_id
        this.ingredientObj.ingredient_unit_id = res.data.ingredientUnit.ingredient_unit_id
        this.ingredientObj.stock_id = res.data.stock.stock_id
      })
    },
    editQuantity () { this.ingredientObj.total = this.ingredientObj.quantity * this.ingredientObj.cost },
    pushIngredientToItemForSave () {
      if (this.$refs.form.validate()) {
        const itemForSaveObj = { ...this.ingredientObj }
        const checkDuplicate = this.itemsForSave.some((item) => item.ingredient_id === itemForSaveObj.ingredient_id)
        if (!checkDuplicate) {
          this.itemsForSave.push(itemForSaveObj)
        }
      }
    },
    aligns (key) {
      switch (key) {
      case 'left':
        return 'text-left'
      case 'right':
        return 'text-right'
      case 'center':
        return 'text-center'
      default:
        return ''
      }
    },
    validate () {
      this.promise.resolve(this.itemsForSave)
      this.$refs.baseModal.close()
      this.clearModal()
    },
    clearModal () {
      this.ingredientObj.ingredient_id = null
      this.ingredientObj.ingredient = null
      this.ingredientObj.cost = 0
      this.ingredientObj.quantity = 0
      this.ingredientObj.unit = ''
      this.ingredientObj.ingredientGroup = ''
      this.ingredientObj.total = 0
      this.ingredientObj.ingredient_group_id = 0
      this.ingredientObj.ingredient_unit_id = 0
      this.ingredientObj.stock_id = 0
      this.itemsForSave = []
      this.edit = false
      if (this.edit) { this.$refs.form.resetValidation() }
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
<template>
  <baseModal
    ref="baseModal"
    :modal-name="modalName"
    width="1000px"
    @close="clearModal"
    @save="validate"
  >
    <template #body>
      <v-form @submit.prevent="validate" ref="form">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card-title class="text-subtitle-1 pa-0">ข้อมูลรายละเอียดเมนูอาหาร</v-card-title>
            <v-row>
              <v-col cols="12" class="pb-1">
                <v-text-field v-model="foodObj.Food_Name" :rules="rules.Food_Name" label="ชื่อเมนูอาหาร" placeholder="ระบุชื่อเมนูอาหาร เช่น ผัดกะเพรา" />
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field v-model="foodObj.Food_Description" :rules="rules.Food_Description" label="คำอธิบาย" placeholder="ระบุคำอธิบาย เช่น ผัดกะเพราอร่อยเหาะ" />
              </v-col>
              <v-col cols="12" sm="6" class="py-1">
                <v-autocomplete
                  v-model.number="foodObj.category_id"
                  :rules="rules.category"
                  :items="category"
                  item-text="Category_Name"
                  item-value="id"
                  label="หมวดหมู่"
                  placeholder="เลือกหมวดหมู่"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6" class="py-1">
                <v-text-field v-model.number="foodObj.Food_Price" :rules="rules.Food_Price" label="ราคา" placeholder="ระบุราคา เช่น 100 เป็นต้น" />
              </v-col>
              <v-col cols="6" class="mb-4 mb-sm-0 py-1">
                <v-switch
                  v-model.number="foodObj.is_recommend"
                  :true-value="1"
                  :false-value="0"
                  label="แนะนำเมนูนี้"
                  hide-details
                />
              </v-col>
              <v-col cols="6" class="mb-4 mb-sm-0 py-1">
                <v-switch
                  v-model.number="foodObj.is_new"
                  hide-details
                  :true-value="1"
                  :false-value="0"
                  label="เมนูใหม่"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6">
            <upload @file="addImage" ref="upload" height="300px" />
          </v-col>
          <v-col cols="12" class="my-6">
            <p> เพิ่ม Options Toppings และ วัตถุดิบที่ต้องใช้ </p>
            <v-row>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="optionObj"
                  :items="option"
                  :rules="rules.option"
                  item-text="Option_Name"
                  item-value="id"
                  label="เลือก option"
                  placeholder="เลือก option"
                  required
                  return-object
                />
              </v-col>
              <v-col cols="12" sm="6" align-self="center" align="end">
                <v-btn class="black--text font-weight-light px-4" color="secondary" elevation="0" width="220px" :block="$vuetify.breakpoint.xs" @click="pushOptionToItemsOption">
                  <v-icon left> mdi-plus </v-icon>
                  เพิ่ม OPTION ที่ต้องใช้
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="toppingObj"
                  :items="topping"
                  :rules="rules.topping"
                  item-text="Topping_Name"
                  label="เลือก topping"
                  placeholder="เลือก topping"
                  required
                  return-object
                />
              </v-col>
              <v-col cols="12" sm="6" align-self="center" align="end">
                <v-btn class="black--text font-weight-light px-4" color="secondary" elevation="0" width="220px" :block="$vuetify.breakpoint.xs" @click="pushToppingToItemsTopping">
                  <v-icon left> mdi-plus </v-icon>
                  เพิ่ม TOPPINGS ที่ต้องใช้
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="ingredientObj"
                  :items="ingredient"
                  :rules="rules.ingredient"
                  item-text="ingredient"
                  label="เลือกวัตถุดิบ"
                  placeholder="เลือกวัตถุดิบ"
                  required
                  return-object
                />
              </v-col>
              <v-col cols="12" sm="6" align-self="center" align="end">
                <v-btn class="black--text font-weight-light px-4" color="secondary" elevation="0" width="220px" :block="$vuetify.breakpoint.xs" @click="pushIngredientToItemIngredient">
                  <v-icon left> mdi-plus </v-icon>
                  เพิ่มวัตถุดิบที่ต้องใช้
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-text v-if="(itemsOption && itemsOption.length > 0) || (itemsTopping && itemsTopping.length > 0) || (itemsIngredient && itemsIngredient.length > 0)" class="pa-0">
          <!-- Option -->
          <listTable name="Options" :headers="headersOption" :items="itemsOption" :show="itemsOption.length > 0">
            <template #index="{ index }">
              <span>{{ index + 1 }}</span>
            </template>
            <template #manage="{ item, index }">
              <v-btn color="primary" icon @click="spliceOption(item, index)">
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>
            </template>
          </listTable>

          <!-- Topping -->
          <listTable name="Topping" :headers="headersTopping" :items="itemsTopping" :show="itemsTopping.length > 0">
            <template #index="{ index }">
              <span>{{ index + 1 }}</span>
            </template>
            <template #manage="{ item, index }">
              <v-btn color="primary" icon @click="spliceTopping(item, index)">
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>
            </template>
          </listTable>

          <!-- Ingredient -->
          <listTable name="Ingredient" :headers="headersIngredient" :items="itemsIngredient" :show="itemsIngredient.length > 0">
            <template #index="{ index }">
              <span>{{ index + 1 }}</span>
            </template>
            <template #ingredientGroup="{ item }">
              <span>{{ edit && item && item.ingredientGroup && item.ingredientGroup.group ? item.ingredientGroup.group : item.ingredientGroup }}</span>
            </template>
            <template #cost="{ item }">
              <span>{{ formatNumber(item.cost) }}</span>
            </template>
            <template #ingredientUnit="{ item }">
              <span>{{ edit && item && item.unit ? item.unit : item.ingredientUnit.unit }}</span>
            </template>
            <template #stock="{ item }">
              <span>{{ edit && item && item.quantity ? formatNumber(item.quantity) : formatNumber(item.stock.quantity) }}</span>
            </template>
            <template #amount_used="{ item }">
              <v-text-field v-model.number="item.amount_used" type="number" min="1" :rules="rules.amount_used" hide-spin-buttons />
            </template>
            <template #manage="{ item, index }">
              <v-btn color="primary" icon @click="spliceIngredient(item, index)">
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>
            </template>
          </listTable>
        </v-card-text>
      </v-form>
    </template>
  </baseModal>
</template>

<script>
import categoryApi from '@/api/categoryApi'
import optionApi from '@/api/optionApi'
import toppingApi from '@/api/toppingApi'
import ingredientApi from '@/api/ingredientApi'
import baseModal from '@/components/backend/modal/base'
import upload from '@/components/backend/upload'
import listTable from '@/components/backend/table/listTable'
import { mixins } from '@/plugins/mixins'
export default {
  name: 'FoodModalComponent',
  components: {
    baseModal,
    upload,
    listTable
  },
  mixins: [mixins],
  data () {
    return {
      edit: false,
      headersOption: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'Option', align: 'start', value: 'Option_Name', width: '15%' },
        { text: 'จัดการ', align: 'center', value: 'manage', width: '10%' }
      ],
      headersTopping: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'Topping', align: 'center', value: 'Topping_Name', width: '15%' },
        { text: 'ราคา', align: 'center', value: 'Topping_Price', width: '15%' },
        { text: 'Active', align: 'center', value: 'isActive', width: '15%' },
        { text: 'จัดการ', align: 'center', value: 'manage', width: '10%' }
      ],
      headersIngredient: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'วัตถุดิบ', align: 'start', value: 'ingredient', width: '10%' },
        { text: 'หมวดหมู่', align: 'center', value: 'ingredientGroup', width: '20%' },
        { text: 'ต้นทุน', align: 'center', value: 'cost', width: '10%' },
        { text: 'หน่วย', align: 'center', value: 'ingredientUnit', width: '10%' },
        { text: 'stock', align: 'center', value: 'stock', width: '10%' },
        { text: 'จำนวนที่ต้องใช้/จาน', align: 'center', value: 'amount_used', width: '15%' },
        { text: 'จัดการ', align: 'center', value: 'manage', width: '10%' }
      ],

      foodObj: {
        Food_Name: '',
        Food_Description: '',
        category_id: null,
        Food_Price: 0,
        Food_Image: null,
        is_recommend: 0,
        is_new: 0,
        is_active: 1
      },

      optionObj: null,
      toppingObj: null,
      ingredientObj: null,

      rules: {
        Food_Name: [ value => !!value || 'Required.' ],
        Food_Description: [ value => !!value || 'Required.' ],
        Food_Price: [ value => value >= 0 || 'Value must be greater than or equal to 0.' ],
        category: [ value => !!value || 'Required.' ],
        option: [ value => !!value || 'Required.' ],
        topping: [ value => !!value || 'Required.' ],
        ingredient: [ value => !!value || 'Required.' ],
        amount_used: [ value => !!value || 'Required.' ]
      },

      category: [],
      option: [],
      topping: [],
      ingredient: [],

      itemsOption: [],
      itemsOptionEdited: [],
      itemsOptionDeleted: [],
      itemsTopping: [],
      itemsToppingEdited: [],
      itemsToppingDeleted: [],
      itemsIngredient: [],
      itemsIngredientOld: [],
      itemsIngredientEdited: [],
      itemsIngredientDeleted: [],
      promise: null
    }
  },
  computed: {
    modalName () {
      return `${ this.edit ? 'แก้ไข' : 'เพิ่ม' }อาหาร`
    }
  },
  mounted () {
    categoryApi.getAll().then((res) => { this.category = res.data })
    optionApi.getAll().then((res) => { this.option = res.data })
    toppingApi.getAll().then((res) => { this.topping = res.data.filter(item => item.isActive === 1) })
    ingredientApi.getAll().then((res) => { this.ingredient = res.data })
  },
  methods: {
    show (data) {
      if (data) {
        this.edit = true
        this.foodObj = {
          Food_Name: data.Food_Name,
          Food_Description: data.Food_Description,
          Food_Price: data.Food_Price,
          Food_Image: data.Food_Image,
          category_id: data.Category.id,
          is_recommend: data.is_recommend,
          is_new: data.is_new,
          is_active: data.is_active
        },

        this.optionObj = data.Option[data.Option.length - 1]
        this.toppingObj = data.Topping[data.Topping.length - 1]
        this.ingredientObj = data.Ingredient[data.Ingredient.length - 1]
        this.itemsOption = data.Option
        this.itemsTopping = data.Topping
        this.itemsIngredient = data.Ingredient
        this.itemsIngredientOld = [ ...data.Ingredient ]

        this.$nextTick(() => {
          this.$refs.upload.imgForEdit(this.foodObj.Food_Image)
        })
      }
      this.$refs.baseModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    addImage (file) {
      this.foodObj.Food_Image = file
    },
    pushOptionToItemsOption () {
      const itemOptionObj = { ...this.optionObj }
      const checkDuplicateOld = this.itemsOption.some((item) => item.id === itemOptionObj.id)
      if (!checkDuplicateOld) { this.itemsOption.push(itemOptionObj) }
      if (this.edit) {
        const checkDuplicateNew = this.itemsOptionEdited.some((item) => item.id === itemOptionObj.id)
        if (!checkDuplicateOld && !checkDuplicateNew) {
          this.itemsOptionEdited.push(itemOptionObj)
        }
      }
    },
    pushToppingToItemsTopping () {
      const itemToppingObj = { ...this.toppingObj }
      const checkDuplicateOld = this.itemsTopping.some((item) => item.id === itemToppingObj.id)
      if (!checkDuplicateOld) { this.itemsTopping.push(itemToppingObj) }
      if (this.edit) {
        const checkDuplicateNew = this.itemsToppingEdited.some((item) => item.id === itemToppingObj.id)
        if (!checkDuplicateOld && !checkDuplicateNew) {
          this.itemsToppingEdited.push(itemToppingObj)
        }
      }
    },
    pushIngredientToItemIngredient () {
      const itemIngredientObj = { ...this.ingredientObj }
      const checkDuplicateOld = this.itemsIngredient.some((item) => (item.food_id ? item.ingredient_id : item.id) === (itemIngredientObj.food_id ? itemIngredientObj.ingredient_id : itemIngredientObj.id))
      if (!checkDuplicateOld) { this.itemsIngredient.push(itemIngredientObj) }
      if (this.edit) {
        const checkDuplicateNew = this.itemsIngredientEdited.some((item) => item.id === itemIngredientObj.id)
        if (!checkDuplicateOld && !checkDuplicateNew) {
          this.itemsIngredientEdited.push(itemIngredientObj)
        }
      }
    },
    spliceOption (option, index) {
      if (!this.edit) {
        this.itemsOption.splice(index, 1)
      } else {
        this.itemsOptionDeleted.push(option)
        this.itemsOption.splice(index, 1)
      }
    },
    spliceTopping (topping, index) {
      if (!this.edit) {
        this.itemsTopping.splice(index, 1)
      } else {
        this.itemsToppingDeleted.push(topping)
        this.itemsTopping.splice(index, 1)
      }
    },
    spliceIngredient (ingredient, index) {
      if (!this.edit) {
        this.itemsIngredient.splice(index, 1)
      } else {
        this.itemsIngredientDeleted.push(ingredient)
        this.itemsIngredient.splice(index, 1)
      }
    },
    validate () {
      if (this.$refs.form.validate()) {
        const FoodFormData = new FormData()
        FoodFormData.append('Food_Name', this.foodObj.Food_Name)
        FoodFormData.append('Food_Price', this.foodObj.Food_Price)
        FoodFormData.append('Food_Description', this.foodObj.Food_Description)
        FoodFormData.append('Food_Image', this.foodObj.Food_Image)
        FoodFormData.append('category_id', this.foodObj.category_id)
        FoodFormData.append('is_recommend', this.foodObj.is_recommend)
        FoodFormData.append('is_new', this.foodObj.is_new)
        FoodFormData.append('is_active', this.foodObj.is_active)

        const mapData = {
          food: FoodFormData,
          option: this.itemsOption,
          topping: this.itemsTopping,
          ingredient: this.itemsIngredient
        }

        const mapDataEdited = {
          food: FoodFormData,
          optionEdited: this.itemsOptionEdited,
          toppingEdited: this.itemsToppingEdited,
          ingredientEdited: this.itemsIngredientEdited,
          optionDeleted: this.itemsOptionDeleted,
          toppingDeleted: this.itemsToppingDeleted,
          ingredientDeleted: this.itemsIngredientDeleted,
          ingredientOld: this.itemsIngredientOld
        }

        this.promise.resolve(!this.edit ? mapData : mapDataEdited)
        this.$refs.baseModal.close()
      }
    },
    clearModal () {
      this.foodObj.Food_Name = ''
      this.foodObj.Food_Description = ''
      this.foodObj.Food_Price = 0
      this.foodObj.Food_Image = null
      this.foodObj.category_id = null
      this.foodObj.is_recommend = 0
      this.foodObj.is_new = 0
      this.foodObj.is_active = 1
      this.itemsOption = []
      this.itemsTopping = []
      this.itemsIngredient = []
      this.itemsOptionEdited = []
      this.itemsToppingEdited = []
      this.itemsIngredientEdited = []
      this.itemsOptionDeleted = []
      this.itemsToppingDeleted = []
      this.itemsIngredientDeleted = []
      this.optionObj = null
      this.toppingObj = null
      this.ingredientObj = null
      this.edit = false
      this.$refs.upload.clearData()
      this.$refs.form.resetValidation()
      this.$emit('reload')
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
<template>
  <div>
    <headerLayout title="จัดการอาหาร" name-btn="เพิ่มอาหาร" @click="addFood" />
    <section id="content">
      <v-container class="white rounded-lg pa-6">
        <v-row no-gutters>
          <v-col cols="12" sm="5">
            <v-form @submit.prevent="searchData">
              <v-text-field v-model="search" class="mb-sm-5" prepend-inner-icon="mdi-magnify" label="ค้นหาอาหาร" placeholder="กรุณาระบุคำค้นหา" hide-details outlined />
              <v-btn v-show="false" type="submit">ค้นหา</v-btn>
            </v-form>
          </v-col>
          <v-col cols="12" sm="7">
            <v-btn @click="searchData" class="ml-0 mt-2 mt-sm-0 ml-sm-4 rounded-lg" color="primary" elevation="0" :height="!$vuetify.breakpoint.xs ? 56 : ''" :block="$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" :x-large="!$vuetify.breakpoint.xs">
              <v-icon left>mdi-magnify</v-icon> ค้นหา
            </v-btn>
            <v-btn @click="clear" class="ml-0 ml-sm-4 mt-2 mt-sm-0 rounded-lg primary--text" color="secondary" elevation="0" :height="!$vuetify.breakpoint.xs ? 56 : ''" :block="$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" :x-large="!$vuetify.breakpoint.xs">
              <v-icon left>mdi-cached</v-icon> ล้าง
            </v-btn>
          </v-col>
        </v-row>
        <flexibleTable
          :headers="headers"
          :items="items"
          :loading="loading"
          striped
        >
          <template #index="{ index }">
            <span>{{ indexPage($store.getters.getCurrentPage, perPage, index) }}</span>
          </template>
          <template #Food_Image="{ item }">
            <v-img :src="item.Food_Image" width="40%" max-width="100px" aspect-ratio="1" contain />
          </template>
          <template #is_active="{ item }">
            <p class="text-truncate mb-0">{{ item.is_active === 1 ? 'ยังมีสินค้า' : 'สินค้าหมด'  }}</p>
          </template>
          <template #created_at="{ item }">
            <p class="text-truncate mb-0">{{ formatDate(item.created_at)  }}</p>
          </template>
          <template #updated_at="{ item }">
            <p class="text-truncate mb-0">{{ formatDate(item.updated_at) }}</p>
          </template>
          <template #manage="{ item }">
            <v-btn class="mr-1 mr-sm-0 mr-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : yellow`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="editFood(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn class="ml-1 ml-sm-0 ml-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : primary`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="deleteFood(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>
        </flexibleTable>
      </v-container>
      <pagination :pageCount="lastPage" @onChangePage="changePage" no-shadow />
    </section>
    <foodModal ref="foodModal" @reload="reload" />
    <confirmModal ref="confirmModal" icon="mdi-trash-can" />
  </div>
</template>

<script>
// API
import foodApi from '@/api/foodApi'
import foodOptionApi from '@/api/foodOptionApi'
import foodToppingApi from '@/api/foodToppingApi'
import foodIngredientApi from '@/api/ingredientFood'
// Component
import headerLayout from '@/components/backend/layout/header'
import flexibleTable from '@/components/backend/table/flexibleTable'
import pagination from '@/components/backend/pagination'
import foodModal from '@/components/backend/modal/food/foodModal'
import confirmModal from '@/components/backend/modal/confirm'
// mixins
import { mixins } from '@/plugins/mixins'
export default {
  name: 'FoodManagementPage',
  components: {
    headerLayout,
    flexibleTable,
    pagination,
    foodModal,
    confirmModal
  },
  mixins:[mixins],
  data () {
    return {
      headers: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'รูปภาพ', align: 'start', value: 'Food_Image', width: '10%' },
        { text: 'ชื่อเมนูอาหาร', align: 'start', value: 'Food_Name', width: '15%' },
        { text: 'ราคา', align: 'center', value: 'Food_Price', width: '10%' },
        { text: 'คำอธิบาย', align: 'start', value: 'Food_Description', width: '20%' },
        { text: 'สินค้าหมด', align: 'center', value: 'is_active', width: '15%' },
        { text: 'สร้างเมื่อ', align: 'center', value: 'updated_at', width: '10%' },
        { text: 'อัพเดตล่าสุด', align: 'center', value: 'updated_at', width: '10%' },
        { text: 'จัดการ', align: 'center', value: 'manage', width: '10%' }
      ],
      items: [],
      search: null,
      loading: false,

      // Pagination
      currentPage: 0,
      perPage: 0,
      total: 0,
      lastPage: 0
    }
  },
  mounted () {
    this.clear()
  },
  methods: {
    fetchData (pageNumber) {
      this.loading = true
      foodApi.getAndCount(pageNumber).then((res) => {
        this.items = res.result.data
        this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page : res.result.current_page)
        this.perPage = res.result.meta ? res.result.meta.per_page : res.result.per_page
        this.total = res.result.meta ? res.result.meta.total : res.result.total
        this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
        this.loading = false
      }).catch((err) => {
        console.log('มีบางอย่างผิดพลาด', err)
        this.loading = false
      })
    },
    searchDataOnChangePage (pageNumber) {
      this.loading = true
      if (this.search) {
        foodApi.search(this.search, pageNumber).then((res) => {
          this.items = res.result.data
          this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page : res.result.current_page)
          this.perPage = res.result.meta ? res.result.meta.per_page : res.result.per_page
          this.total = res.result.meta ? res.result.meta.total : res.result.total
          this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
          this.loading = false
        }).catch(() => {
          console.log('ไม่พบข้อมูลที่ค้นหา')
          this.loading = false
        })
      } else {
        this.clear()
      }
    },
    searchData () {
      this.loading = true
      if (this.search) {
        foodApi.search(this.search).then((res) => {
          this.items = res.result.data
          this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page : res.result.current_page)
          this.perPage = res.result.meta ? res.result.meta.per_page : res.result.per_page
          this.total = res.result.meta ? res.result.meta.total : res.result.total
          this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
          this.loading = false
        }).catch(() => {
          console.log('ไม่พบข้อมูลที่ค้นหา')
          this.loading = false
        })
      } else {
        this.clear()
      }
    },
    addFood () {
      this.$refs.foodModal.show().then((modalRes) => {
        this.loading = true
        foodApi.create(modalRes.food).then((foodRes) => {
          modalRes.option.forEach(option => {
            foodOptionApi.create({ food_id: foodRes.data.id, option_id: option.id })
          })
          modalRes.topping.forEach(topping => {
            foodToppingApi.create({ food_id: foodRes.data.id, topping_id: topping.id })
          })
          modalRes.ingredient.forEach(ingredient => {
            foodIngredientApi.create({ food_id: foodRes.data.id, ingredient_id: ingredient.id, amount_used: ingredient.amount_used })
          })
          if (!this.search) {
            this.fetchData(this.$store.getters.getCurrentPage)
          } else {
            this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
          }
        }).catch((error) =>{
          console.log('error', error)
          this.loading = false
        })
      })
    },
    editFood (foodObj) {
      this.$refs.foodModal.show(foodObj).then((res) => {
        this.loading = true
        const food = res.food
        foodApi.update(foodObj.id, food).then(() => {
          this.logicEditedFood(res, foodOptionApi, foodToppingApi, foodIngredientApi, foodObj)
        }).catch((error) =>{
          console.log('error', error)
          this.loading = false
        })
      })
    },
    async logicEditedFood (res, foodOptionApi, foodToppingApi, foodIngredientApi, foodObj) {
      const deleteFoodOption = async (foodOptionApi, foodObj, element) => {
        const res = await foodOptionApi.getAll().catch(() => this.loading = false)
        const foodOption = res.data.filter(item => (item.food_id === foodObj.id) && (item.option_id === element.id))
        const foodOptionID = foodOption && foodOption.length > 0 ? foodOption[0].id : false
        if (foodOptionID) {
          await foodOptionApi.delete(foodOptionID).catch(() => this.loading = false)
        }
      }
      const createFoodOption = async (foodOptionApi, foodObj, element) => {
        await foodOptionApi.create({ food_id: foodObj.id, option_id: element.id }).catch(() => this.loading = false)
      }

      const deleteFoodTopping = async (foodToppingApi, foodObj, element) => {
        const res = await foodToppingApi.getAll().catch(() => this.loading = false)
        const foodTopping = res.data.filter(item => (item.food_id === foodObj.id) && (item.topping_id === element.id))
        const foodToppingID = foodTopping && foodTopping.length > 0 ? foodTopping[0].id : false
        if (foodToppingID) {
          await foodToppingApi.delete(foodToppingID).catch(() => this.loading = false)
        }
      }
      const createFoodTopping = async (foodToppingApi, foodObj, element) => {
        await foodToppingApi.create({ food_id: foodObj.id, topping_id: element.id }).catch(() => this.loading = false)
      }

      const deleteFoodIngredient = async (foodIngredientApi, foodObj, element) => {
        const res = await foodIngredientApi.getAll().catch(() => this.loading = false)
        const foodIngredient = await res.data.filter(item => (item.food_id === foodObj.id) && (item.ingredient_id === element.ingredient_id))
        const foodIngredientID = foodIngredient && foodIngredient.length > 0 ? foodIngredient[0].id : false
        if (foodIngredientID) {
          await foodIngredientApi.delete(foodIngredientID).catch(() => this.loading = false)
        }
      }
      const updateIngredient = async (foodIngredientApi, foodObj, element) => {
        const res = await foodIngredientApi.getAll().catch(() => this.loading = false)
        const foodIngredient = await res.data.filter(item => (item.food_id === foodObj.id) && (item.ingredient_id === element.ingredient_id))
        const foodIngredientID = foodIngredient && foodIngredient.length > 0 ? foodIngredient[0].id : false
        if (foodIngredientID) {
          await foodIngredientApi.update(foodIngredientID, { food_id: foodObj.id, ingredient_id: element.ingredient_id, amount_used: element.amount_used }).catch(() => this.loading = false)
        }
      }
      const createFoodIngredient = async (foodIngredientApi, foodObj, element) => {
        await foodIngredientApi.create({ food_id: foodObj.id, ingredient_id: element.id, amount_used: element.amount_used }).catch(() => this.loading = false)
      }

      if (res.optionDeleted && res.optionDeleted.length > 0) {
        await Promise.all(res.optionDeleted.map(element => deleteFoodOption(foodOptionApi, foodObj, element)))
      }
      if (res.optionEdited && res.optionEdited.length > 0) {
        await Promise.all(res.optionEdited.map(element => createFoodOption(foodOptionApi, foodObj, element)))
      }
      if (res.toppingDeleted && res.toppingDeleted.length > 0) {
        await Promise.all(res.toppingDeleted.map(element => deleteFoodTopping(foodToppingApi, foodObj, element)))
      }
      if (res.toppingEdited && res.toppingEdited.length > 0) {
        await Promise.all(res.toppingEdited.map(element => createFoodTopping(foodToppingApi, foodObj, element)))
      }
      if (res.ingredientDeleted && res.ingredientDeleted.length > 0) {
        await Promise.all(res.ingredientDeleted.map(element => deleteFoodIngredient(foodIngredientApi, foodObj, element)))
      }
      if ((res.ingredientOld && res.ingredientOld.length > 0) ||
          (res.ingredientEdited && res.ingredientEdited.length > 0)) {
        await Promise.all(res.ingredientOld.map(element => updateIngredient(foodIngredientApi, foodObj, element)))
        await Promise.all(res.ingredientEdited.map(element => createFoodIngredient(foodIngredientApi, foodObj, element)))
      }
      if (!this.search) {
        this.fetchData(this.$store.getters.getCurrentPage)
      } else {
        this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
      }
    },
    deleteFood (foodObj) {
      const text = `คุณต้องการลบ "${foodObj.Food_Name}" หรือไม่`
      this.$refs.confirmModal.show(foodObj, text).then((res) => {
        this.loading = true
        foodApi.delete(res.id).then(() => {
          if (!this.search) {
            this.fetchData(this.$store.getters.getCurrentPage)
          } else {
            this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
          }
        }).catch((error) =>{
          console.log('error', error)
          this.loading = false
        })
      })
    },
    changePage (event) {
      this.$store.commit('setCurrentPage', event)
      if (!this.search) {
        this.fetchData(this.$store.getters.getCurrentPage)
      } else {
        this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
      }
    },
    clear () {
      this.search = null
      this.$store.commit('setCurrentPage', 1)
      this.fetchData(this.$store.getters.getCurrentPage)
    },
    reload () {
      if (!this.search) {
        this.fetchData(this.$store.getters.getCurrentPage)
      } else {
        this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
      }
    }
  }
}
</script>

<style>

</style>
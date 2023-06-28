<template>
  <div>
    <headerLayout title="จัดการข้อมูลวัตถุดิบ" name-btn="เพิ่มข้อมูลวัตถุดิบ" @click="addIngredient" />
    <section id="content">
      <v-container class="white rounded-lg pa-6">
        <v-row no-gutters>
          <v-col cols="12" sm="5">
            <v-form @submit.prevent="searchData">
              <v-text-field v-model="search" class="mb-sm-5" prepend-inner-icon="mdi-magnify" label="ค้นหาวัตถุดิบ" placeholder="กรุณาระบุคำค้นหา" hide-details outlined autofocus/>
              <v-btn v-show="false" type="submit">ค้นหา</v-btn>
            </v-form>
          </v-col>
          <v-col cols="12" sm="7">
            <v-btn @click="searchData" class="ml-0 mt-2 mt-sm-0 ml-sm-4 rounded-lg" color="primary" elevation="0" :height="!$vuetify.breakpoint.xs ? 56 : ''" :block="$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" :x-large="!$vuetify.breakpoint.xs">
              <v-icon left>mdi-magnify</v-icon>
              ค้นหา
            </v-btn>
            <v-btn @click="clear" class="ml-0 ml-sm-4 mt-2 mt-sm-0 rounded-lg primary--text" color="secondary" elevation="0" :height="!$vuetify.breakpoint.xs ? 56 : ''" :block="$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" :x-large="!$vuetify.breakpoint.xs">
              <v-icon left>mdi-cached</v-icon>
              ล้าง
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
          <template #ingredientGroup="{ item }">
            <span>{{ item.ingredientGroup.group }}</span>
          </template>
          <template #cost="{ item }">
            <span>{{ formatNumber(item.cost) }}</span>
          </template>
          <template #ingredientUnit="{ item }">
            <span>{{ item.ingredientUnit.unit }}</span>
          </template>
          <template #stock="{ item }">
            <span>{{ formatNumber(item.stock ? item.stock.quantity : 0) }}</span>
          </template>
          <template #manage="{ item }">
            <v-btn class="mr-1 mr-sm-0 mr-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : yellow`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="editIngredient(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn class="ml-1 ml-sm-0 ml-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : primary`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="deleteIngredient(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>
        </flexibleTable>
      </v-container>
      <pagination :pageCount="lastPage" @onChangePage="changePage" no-shadow />
    </section>
    <ingredientModal ref="ingredientModal" />
    <confirmModal ref="confirmModal" icon="mdi-trash-can" />
  </div>
</template>

<script>
// API
import ingredientApi from '@/api/ingredientApi'
import stockApi from '@/api/stockApi'
// Component
import headerLayout from '@/components/backend/layout/header'
import flexibleTable from '@/components/backend/table/flexibleTable'
import pagination from '@/components/backend/pagination'
import ingredientModal from '@/components/backend/modal/ingredient/ingredientModal'
import confirmModal from '@/components/backend/modal/confirm'
// mixins
import { mixins } from '@/plugins/mixins'
export default {
  name: 'IngredientManagementPage',
  components: {
    headerLayout,
    flexibleTable,
    pagination,
    ingredientModal,
    confirmModal
  },
  mixins:[mixins],
  data () {
    return {
      headers: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'วัตถุดิบ', align: 'start', value: 'ingredient', width: '15%' },
        { text: 'หมวดหมู่', align: 'center', value: 'ingredientGroup', width: '15%' },
        { text: 'ต้นทุน', align: 'center', value: 'cost', width: '10%' },
        { text: 'หน่วย', align: 'center', value: 'ingredientUnit', width: '10%' },
        { text: 'จำนวนสต๊อก', align: 'center', value: 'stock', width: '10%' },
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
      ingredientApi.getAndCount(pageNumber).then((res) => {
        this.items = res.result.data
        this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page : res.result.current_page)
        this.perPage = res.result.meta ? res.result.meta.per_page : res.result.per_page
        this.total = res.result.meta ? res.result.meta.total : res.result.total
        this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
        this.loading = false
      }).catch(() => {
        console.log('มีบางอย่างผิดพลาด')
        this.loading = false
      })
    },
    searchData () {
      this.loading = true
      if (this.search) {
        ingredientApi.search(this.search).then((res) => {
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
    searchDataOnChangePage (pageNumber) {
      this.loading = true
      if (this.search) {
        ingredientApi.search(this.search, pageNumber).then((res) => {
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
    addIngredient () {
      this.$refs.ingredientModal.show().then((resIngredient) => {
        this.loading = true
        const stock = { quantity: 0 }
        stockApi.create(stock).then((res) => {
          const ingredient = {
            ingredient: resIngredient.ingredient,
            cost: resIngredient.cost,
            stock_id: res.data.id,
            ingredient_group_id: resIngredient.ingredient_group_id,
            ingredient_unit_id: resIngredient.ingredient_unit_id
          }
          ingredientApi.create(ingredient).then(() => {
            if (!this.search) {
              this.fetchData(this.$store.getters.getCurrentPage)
            } else {
              this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
            }
            this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'เพิ่มข้อมูลสำเร็จ' })
          }).catch((error) => {
            console.log('error', error)
            this.loading = false
            this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'มีบางอย่างผิดพลาด' })
          })
        }).catch((error) => {
          console.log('error', error)
          this.loading = false
          this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'มีบางอย่างผิดพลาด' })
        })
      })
    },
    editIngredient (ingredientObj) {
      this.$refs.ingredientModal.show(ingredientObj).then((res) => {
        this.loading = true
        ingredientApi.update(ingredientObj.id, res).then(() => {
          if (!this.search) {
            this.fetchData(this.$store.getters.getCurrentPage)
          } else {
            this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
          }
          this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'แก้ไขข้อมูลสำเร็จ' })
        }).catch((error) => {
          console.log('error', error)
          this.loading = false
          this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'มีบางอย่างผิดพลาด', icon: 'error' })
        })
      })
    },
    deleteIngredient (ingredientObj) {
      const text = `คุณต้องการลบ "${ingredientObj.ingredient}" หรือไม่`
      this.$refs.confirmModal.show(ingredientObj, text).then((res) => {
        this.loading = true
        ingredientApi.delete(res.id).then(() => {
          if (!this.search) {
            this.fetchData(this.$store.getters.getCurrentPage)
          } else {
            this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
          }
          this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'ลบข้อมูลสำเร็จ' })
        }).catch((error) => {
          console.log('error', error)
          this.loading = false
          this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'มีบางอย่างผิดพลาด' })
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
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

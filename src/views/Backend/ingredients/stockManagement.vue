<template>
  <div>
    <headerLayout title="จัดการสต๊อกของวัตถุดิบ" name-btn="เพิ่มสต๊อกของวัตถุดิบของวันนี้" @click="addStock" />
    <v-container class="white rounded-lg pa-6">
      <flexibleTable
        :headers="headers"
        :items="items"
        :loading="loading"
        striped
      >
        <template #index="{ index }">
          <span>{{ indexPage($store.getters.getCurrentPage, perPage, index) }}</span>
        </template>
        <template #importDate="{ item }">
          <span>{{ item.importDate }}</span>
        </template>
        <template #manage="{ item }">
          <v-btn class="ml-1 mr-sm-0 mr-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : yellow`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="checkStock(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </flexibleTable>
      <pagination :pageCount="lastPage" @onChangePage="changePage" no-shadow />
    </v-container>
    <stockModal ref="stockModal" />
  </div>
</template>

<script>
// API
import stockApi from '@/api/stockApi'
import stockDateApi from '@/api/stockDateApi'
import logDateStockApi from '@/api/logDateStockApi'
// Component
import headerLayout from '@/components/backend/layout/header'
import flexibleTable from '@/components/backend/table/flexibleTable'
import pagination from '@/components/backend/pagination'
import stockModal from '@/components/backend/modal/ingredient/stockModal'
// mixins
import { mixins } from '@/plugins/mixins'
export default {
  name: 'StockManagementPage',
  components: {
    headerLayout,
    flexibleTable,
    pagination,
    stockModal
  },
  mixins:[mixins],
  data () {
    return {
      headers: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'จำนวนรวยการวัตถุดิบที่นำเข้า', align: 'center', value: 'importQty', width: '15%' },
        { text: 'วันที่นำเข้าวัตถุดิบ', align: 'center', value: 'importDate', width: '20%' },
        { text: 'จัดการ', align: 'center', value: 'manage', width: '10%' }
      ],
      items: [],
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
      stockDateApi.getAndCount(pageNumber).then((res) => {
        this.items = res.result.data.map((item) => {
          const newObj = {}
          newObj.id = item.id
          newObj.importQty = item.ingredient.length
          newObj.importDateId = item.date ? item.date.stock_date_id : undefined
          newObj.importDate = item.date ? item.date.stock_date : undefined
          return newObj
        })
        this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
        this.perPage = res.result.meta ? res.result.meta.per_page : res.result.per_page
        this.total = res.result.meta ? res.result.meta.total : res.result.total
        this.loading = false
      }).catch((err) => {
        console.log('มีบางอย่างผิดพลาด', err)
        this.loading = false
      })
    },
    async addStock () {
      try {
        const modalResponse = await this.$refs.stockModal.show()
        const stockDateGetAllResponse = await stockDateApi.getAll()
        const stockDateAllData = stockDateGetAllResponse.data
        // ตรวจสอบ DB stock_date ว่ามีวันที่ ที่ถูกสร้างไว้แล้วหรือยัง
        if (stockDateAllData.length > 0) {
          // ถ้ามีให้ค้นหาต่อว่าวันที่ ที่ return มาจาก modal ถูกสร้างใน DB stock_date แล้วหรือยัง
          const dateNow = modalResponse[0].date
          const dateInDB = stockDateAllData.map(item => item.date.stock_date)
          const condition = dateInDB.includes(dateNow)
          // ถ้ามีวันที่ใน stock_date และ ในนั้นมีวันที่ที่กำลังจะเพิ่มเข้าไป
          if (condition) {
            // ให้ทำการ อัพเดต stock ของ ingredient ที่ลูกค้าเพิ่มใหม่ และ join ingredients_id กับ stock_date_id ในตาราง log_date_stock เป็นวันเดียวกันทั้งหมด เพื่อเก็บ log
            const dateObjInDB = stockDateAllData.map(item => item.date).filter(item => item.stock_date === dateNow)
            const stock_date_id = dateObjInDB[0].stock_date_id

            await Promise.all(modalResponse.map(async (element) => {
              await stockApi.update(element.stock_id, { quantity: element.quantity })
              const logDateStockObj = {
                ingredient_id: element.ingredient_id,
                stock_date_id: stock_date_id,
                quantity: element.quantity
              }
              await logDateStockApi.create(logDateStockObj).then(() => {
                this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'เพิ่มข้อมูลสำเร็จ' })
              })
            }))
          }
          // แต่ถ้ามีวันที่ใน stock_date แต่ในนั้นไม่มีวันที่ที่กำลังจะเพิ่มเข้าไป
          else {
            // ให้ทำการสร้างวันที่ก่อน แล้วค่อย join ingredients_id กับ stock_date_id ในตาราง log_date_stock เป็นวันเดียวกันทั้งหมด
            const res = await stockDateApi.create({ date: dateNow })

            await Promise.all(modalResponse.map(async (element) => {
              await stockApi.update(element.stock_id, { quantity: element.quantity })
              const logDateStockObj = {
                ingredient_id: element.ingredient_id,
                stock_date_id: res.data.id,
                quantity: element.quantity
              }
              await logDateStockApi.create(logDateStockObj).then(() => {
                this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'เพิ่มข้อมูลสำเร็จ' })
              })
            }))
          }
        }
        // ถ้าวันที่ไม่มีใน DB stock_date ให้สร้างวันที่ให้กับ stock_date ใหม่
        else {
          const dateNow = modalResponse[0].date
          const res = await stockDateApi.create({ date: dateNow })

          await Promise.all(modalResponse.map(async (element) => {
            await stockApi.update(element.stock_id, { quantity: element.quantity })
            const logDateStockObj = {
              ingredient_id: element.ingredient_id,
              stock_date_id: res.data.id,
              quantity: element.quantity
            }
            await logDateStockApi.create(logDateStockObj).then(() => {
              this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'เพิ่มข้อมูลสำเร็จ' })
            })
          }))
        }
        await this.fetchData(1)
      } catch (error) {
        console.log('error', error)
        this.loading = false
        this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'มีบางอย่างผิดพลาด', icon: 'error' })
      }
    },
    checkStock (data) {
      logDateStockApi.getAll().then((res) => {
        const responseFilters = res.data.filter(item => item.date.stock_date_id === data.id)
        this.$refs.stockModal.show(responseFilters)
      }).catch((error) => {
        console.log('error', error)
      })
    },
    changePage (event) {
      this.$store.commit('setCurrentPage', event)
      this.fetchData(this.$store.getters.getCurrentPage)
    },
    clear () {
      this.$store.commit('setCurrentPage', 1)
      this.fetchData(this.$store.getters.getCurrentPage)
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

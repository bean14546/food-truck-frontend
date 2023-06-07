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
import stockApi from '@/api/stockApi'
import stockDateApi from '@/api/stockDateApi'
import logDateStockApi from '@/api/logDateStockApi'
import pagination from '@/components/backend/pagination'
import headerLayout from '@/components/backend/layout/header'
import flexibleTable from '@/components/backend/table/flexibleTable'
import stockModal from '@/components/backend/modal/ingredient/stockModal'
import { mixins } from '@/plugins/mixins'
export default {
  name: 'StockManagementPage',
  components: {
    headerLayout,
    flexibleTable,
    stockModal,
    pagination
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
    addStock () {
      this.$refs.stockModal.show().then((modalResponse) => {
        // ดึงข้อมูลของวันนี้
        stockDateApi.getAll().then((stockDateGetAllResponse) => {
          // ถ้าข้อมูลของ Stock Date มีค่า (ครั้งแรกหลังจาก migrate DB)
          if (stockDateGetAllResponse && stockDateGetAllResponse.data.length > 0) {
            stockDateApi.search(modalResponse[0].date).then((stockDateSearchResponse) => {
              // ถ้าค้นหาวันที่เจอ
              if (stockDateSearchResponse && stockDateSearchResponse.data.length > 0) {
                stockDateApi.getOne(stockDateSearchResponse.data[0].id).then((stockDateGetOne) => {
                  // เช็คว่าใน DB ของวันนี้มี ingredient_id ที่ซ้ำกับตัวที่กำลังจเพิ่มลงไปใหม่หรือไม่
                  const dataInDatabase = stockDateGetOne.data.ingredient
                  const dataInRes = modalResponse.map(item => item.ingredient_id)
                  const condition = dataInDatabase.some(element => dataInRes.includes(element.ingredient_id))
                  if (!condition) {
                    this.manageStock(modalResponse)
                  } else {
                    console.log('วันนี้ได้เพิ่มจำนวนของวัตถุดิบนี้ไปแล้ว') // อย่าลืม เปลี่ยนเป็น tost
                  }
                }).catch((error) =>{
                  console.log('error', error)
                })
              }
              // ถ้าค้นหาวันที่ไม่เจอ
              else {
                this.manageStock(modalResponse)
              }
            }).catch((error) =>{
              console.log('error', error)
            })
          }
          // ถ้าข้อมูลของ Stock Date ไม่มีค่า (ครั้งแรกหลังจาก migrate DB)
          else {
            this.manageStock(modalResponse)
          }
        }).catch((error) =>{
          console.log('error', error)
        })
        this.fetchData()
      })
    },
    manageStock (modalResponse) {
      modalResponse.forEach(element => {
        stockApi.update(element.stock_id, { quantity: element.quantity }).then(() => {
          stockDateApi.search(element.date).then((stockDateSearchResponse2) => {
            if (stockDateSearchResponse2.data.length > 0 && stockDateSearchResponse2.data[0].id) {
              const logDateStockObj = {
                stock_date_id: stockDateSearchResponse2.data[0].id,
                ingredient_id: element.ingredient_id
              }
              logDateStockApi.create(logDateStockObj)
            } else {
              stockDateApi.create({ date: element.date }).then((stockDateCreateResponse) => {
                const logDateStockObj = {
                  stock_date_id: stockDateCreateResponse.data.id,
                  ingredient_id: element.ingredient_id
                }
                logDateStockApi.create(logDateStockObj)
              }).catch((error) =>{
                console.log('error', error)
              })
            }
          }).catch((error) =>{
            console.log('error', error)
          })
        }).catch((error) =>{
          console.log('error', error)
        })
      })
    },
    checkStock (item) {
      stockDateApi.getOne(item.id).then((res) => {
        this.$refs.stockModal.show(res.data)
      }).catch((error) =>{
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

<style>

</style>
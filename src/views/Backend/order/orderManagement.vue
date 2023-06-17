<template>
  <div>
    <headerLayout title="จัดการ Order" name-btn="เพิ่ม Order" none-btn />
    <section id="content">
      <v-container class="white rounded-lg pa-6">
        <v-tabs v-model="tab" class="mb-4">
          <template v-for="(status, index) in listStatusItems" >
            <v-tab :href="`#${index}`" :key="`${status.Order_List_Status_Name}-${index}`">
              {{ status.Order_List_Status_Name }}
            </v-tab>
          </template>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :value="tab">
            <flexibleTable
              :headers="headers"
              :items="statusFilterTab"
              :loading="loading"
              striped
            >
              <template #index="{ index }">
                <span>{{ index + 1 }}</span>
              </template>
              <template #Food_Image="{ item }">
                <v-img :src="item.Food.Food_Image" width="40%" max-width="100px" aspect-ratio="1" contain />
              </template>
              <template #Food_Name="{ item }">
                <span> {{ item.Food.Food_Name }} </span>
              </template>
              <template #total_price="{ item }">
                <span>{{ formatPrice(item.Price) }}</span>
              </template>
              <template #order_list_status_id="{ item }">
                <span>{{ mapStatus(item.order_list_status_id) }}</span>
              </template>
              <template #created_at="{ item }">
                <span>{{ formatDate(item.created_at) }}</span>
              </template>
              <template #manage="{ item }">
                <v-btn class="mr-1 mr-sm-0 mr-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : yellow`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="checkOrder(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn v-if="item.order_list_status_id === 1" class="ml-1 ml-sm-0 ml-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : primary`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="cancelOrder(item)">
                  <v-icon>mdi-cancel</v-icon>
                </v-btn>
              </template>
            </flexibleTable>
          </v-tab-item>
        </v-tabs-items>
        <pagination :pageCount="lastPage" @onChangePage="changePage" no-shadow />
      </v-container>
    </section>
    <checkOrderListModal ref="checkOrderListModal" />
    <countdownOrderModal ref="countdownOrderModal" />
    <cancelOrderListModal ref="cancelOrderListModal" />
  </div>
</template>

<script>
// API
import orderListApi from '@/api/orderListApi'
// import orderListStatusApi from '@/api/orderListStatusApi'
// import countdownApi from '@/api/countdownApi'
// Component
import headerLayout from '@/components/backend/layout/header'
import flexibleTable from '@/components/backend/table/flexibleTable'
import pagination from '@/components/backend/pagination'
import checkOrderListModal from '@/components/backend/modal/orderList/orderListManage/checkOrderList'
import countdownOrderModal from '@/components/backend/modal/orderList/orderListManage/countdownOrderList'
import cancelOrderListModal from '@/components/backend/modal/orderList/orderListManage/cancelOrderList'
// mixins
import { mixins } from '@/plugins/mixins'
export default {
  name: 'OrderManagementPage',
  components: {
    headerLayout,
    flexibleTable,
    pagination,
    checkOrderListModal,
    countdownOrderModal,
    cancelOrderListModal
  },
  mixins:[mixins],
  data () {
    return {
      tab: null,
      page: 1,
      length: null,
      headers: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'รูปภาพ', align: 'start', value: 'Food_Image', width: '15%' },
        { text: 'ออเดอร์', align: 'start', value: 'Food_Name', width: '15%' },
        { text: 'ราคา', align: 'center', value: 'total_price', width: '15%' },
        { text: 'สถานะ', align: 'center', value: 'order_list_status_id', width: '15%' },
        { text: 'สร้างเมื่อ', align: 'center', value: 'created_at', width: '15%' },
        { text: 'จัดการ', align: 'center', value: 'manage', width: '10%' }
      ],
      itemsWaitingStatus: [],
      itemsInProgressStatus: [],
      itemsCancelStatus: [],
      itemsSuccessStatus: [],
      listStatusItems: [],
      time: [],
      loading: false,

      // Pagination
      currentPage: 0,
      perPage: 0,
      total: 0,
      lastPage: 0
    }
  },
  computed: {
    statusFilterTab () {
      let items = []
      switch (Number(this.tab)) {
      case 0:
        items = this.itemsWaitingStatus
        break
      case 1:
        items = this.itemsInProgressStatus
        break
      case 2:
        items = this.itemsCancelStatus
        break
      case 3:
        items = this.itemsSuccessStatus
        break
      }
      return items
    }
  },
  mounted () {
    this.clear()
  },
  methods: {
    // fetchData (pageNumber) {
    //   this.loading = true
    //   // Waiting Status
    //   orderListApi.getAndCountOrderListID1(pageNumber).then((res) => {
    //     this.itemsWaitingStatus = res.result.data
    //     this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
    //     this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
    //     this.total = res.result.meta ? res.result.meta.total : res.result.total
    //     this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
    //   }).catch((err) => {
    //     console.log('มีบางอย่างผิดพลาด', err)
    //     this.loading = false
    //   })
    //   // InProgress Status
    //   orderListApi.getAndCountOrderListID2(pageNumber).then((res) => {
    //     this.itemsInProgressStatus = res.result.data
    //     this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
    //     this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
    //     this.total = res.result.meta ? res.result.meta.total : res.result.total
    //     this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
    //   }).catch((err) => {
    //     console.log('มีบางอย่างผิดพลาด', err)
    //     this.loading = false
    //   })
    //   // Cancel Status
    //   orderListApi.getAndCountOrderListID3(pageNumber).then((res) => {
    //     this.itemsCancelStatus = res.result.data
    //     this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
    //     this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
    //     this.total = res.result.meta ? res.result.meta.total : res.result.total
    //     this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
    //   }).catch((err) => {
    //     console.log('มีบางอย่างผิดพลาด', err)
    //     this.loading = false
    //   })
    //   // Success Status
    //   orderListApi.getAndCountOrderListID4(pageNumber).then((res) => {
    //     this.itemsSuccessStatus = res.result.data
    //     this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
    //     this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
    //     this.total = res.result.meta ? res.result.meta.total : res.result.total
    //     this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
    //     this.loading = false
    //   }).catch((err) => {
    //     console.log('มีบางอย่างผิดพลาด', err)
    //     this.loading = false
    //   })

    //   orderListStatusApi.getAll().then((res) => {
    //     this.listStatusItems = res.data
    //   })
    //   countdownApi.getAll().then((res) => {
    //     this.time = res.data
    //   })
    // },
    checkOrder (item) {
      this.$refs.checkOrderListModal.show(item).then(() => {
        const checkOrder = { ...item }
        this.$refs.countdownOrderModal.show(this.time).then((res) => {
          console.log(checkOrder)
          console.log(res)
        })
      })
    },
    cancelOrder (item) {
      this.$refs.cancelOrderListModal.show().then((res) => {
        this.loading = true
        const orderListObj = { ...item, order_list_status_id: 3, Chef_Note: res }
        orderListApi.update(orderListObj.id ,orderListObj).then(() => {
          this.fetchData()
        }).catch((error) =>{
          console.log('error', error)
          this.loading = false
        })
      })
    },
    mapStatus (id) {
      let status = ''
      switch (id) {
      case 1:
        status = 'รอยืนยัน'
        break
      case 2:
        status = 'กำลังดำเนินการ'
        break
      case 3:
        status = 'ยกเลิก'
        break
      case 4:
        status = 'ดำเนินการสำเร็จ'
        break
      }
      return status
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
<template>
  <div>
    <headerLayout title="จัดการ Order" name-btn="เพิ่ม Order" none-btn />
    <section id="content">
      <v-container class="white rounded-lg pa-6">
        <v-tabs v-model="tab" class="mb-4" prev-icon>
          <template v-for="(status, index) in listStatusItems">
            <v-tab :href="`#${index}`" :key="`order-status-${index}`" @click="selectTab(index)">
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
      </v-container>
      <pagination :pageCount="lastPage" @onChangePage="changePage" no-shadow />
    </section>
    <checkOrderListModal ref="checkOrderListModal" />
    <countdownOrderModal ref="countdownOrderModal" />
    <cancelOrderListModal ref="cancelOrderListModal" />
  </div>
</template>

<script>
// API
import orderListApi from '@/api/orderListApi'
import orderListStatusApi from '@/api/orderListStatusApi'
import countdownApi from '@/api/countdownApi'
import stockApi from '@/api/stockApi'
// Component
import headerLayout from '@/components/backend/layout/header'
import flexibleTable from '@/components/backend/table/flexibleTable'
import pagination from '@/components/backend/pagination'
import checkOrderListModal from '@/components/backend/modal/orderList/orderListManage/checkOrderList'
import countdownOrderModal from '@/components/backend/modal/orderList/orderListManage/countdownOrderList'
import cancelOrderListModal from '@/components/backend/modal/orderList/orderListManage/cancelOrderList'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite'
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
    async fetchData () {
      this.loading = true
      await this.fetchFilterTab(this.tab)
      await orderListStatusApi.getAll().then((res) => {
        this.listStatusItems = res.data
      })
      await countdownApi.getAll().then((res) => {
        this.time = res.data
        this.loading = false
      })
    },
    fetchID1 (pageNumber) {
      // Waiting Status
      this.loading = true
      orderListApi.getAndCountOrderListID1(pageNumber).then((res) => {
        this.itemsWaitingStatus = res.result.data
        this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
        this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
        this.total = res.result.meta ? res.result.meta.total : res.result.total
        this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
        this.loading = false
      }).catch((err) => {
        console.log('มีบางอย่างผิดพลาด', err)
        this.loading = false
      })
    },
    fetchID2 (pageNumber) {
      // InProgress Status
      this.loading = true
      orderListApi.getAndCountOrderListID2(pageNumber).then((res) => {
        this.itemsInProgressStatus = res.result.data
        this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
        this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
        this.total = res.result.meta ? res.result.meta.total : res.result.total
        this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
        this.loading = false
      }).catch((err) => {
        console.log('มีบางอย่างผิดพลาด', err)
        this.loading = false
      })
    },
    fetchID3 (pageNumber) {
      // Cancel Status
      this.loading = true
      orderListApi.getAndCountOrderListID3(pageNumber).then((res) => {
        this.itemsCancelStatus = res.result.data
        this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
        this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
        this.total = res.result.meta ? res.result.meta.total : res.result.total
        this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
        this.loading = false
      }).catch((err) => {
        console.log('มีบางอย่างผิดพลาด', err)
        this.loading = false
      })
    },
    fetchID4 (pageNumber) {
      // Success Status
      this.loading = true
      orderListApi.getAndCountOrderListID4(pageNumber).then((res) => {
        this.itemsSuccessStatus = res.result.data
        this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
        this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
        this.total = res.result.meta ? res.result.meta.total : res.result.total
        this.lastPage = res.result.meta ? res.result.meta.last_page : res.result.last_page
        this.loading = false
      }).catch((err) => {
        console.log('มีบางอย่างผิดพลาด', err)
        this.loading = false
      })
    },
    async selectTab (tab) {
      await this.$store.commit('setCurrentPage', 1)
      await this.fetchFilterTab(tab)
    },
    checkOrder (item) {
      this.$refs.checkOrderListModal.show(item).then((modalResponse) => {
        const checkOrder = { ...modalResponse }
        const order_list_id = checkOrder.id
        if (item.order_list_status_id === 1) {
          this.$refs.countdownOrderModal.show(this.time).then((res) => {
            if (checkOrder.Ingredient && !checkOrder.Ingredient.some(item => item.quantity === 0)) {
              checkOrder.Ingredient.forEach((item) => {
                const stock_id = item.stock_id
                const calculate_amount_used = { quantity: item.quantity >= item.amount_used ? item.quantity - item.amount_used : 0 }
                stockApi.update(stock_id, calculate_amount_used)
              })
              const order_list_status_id = 2
              const time_countdown_id = res.id
              const orderListObj = { order_list_status_id, time_countdown_id }
              orderListApi.update(order_list_id, orderListObj).then(() => {
                this.clear()
              })
              // firebase countdown
              const orderListId = order_list_id
              const startTime = Date.now()
              const countdownDuration = (res.time * 60) * 1000 // หน่วยเป็ย มิลลิวินาที
              this.startCountdown(orderListId, startTime, countdownDuration)
              this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'รับออร์เดอร์นี้แล้ว' })
            } else {
              this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', icon: 'error', title: 'วัตถุดิบหมด กรุณากดยกเลิกออร์เดอร์นี้!!!' })
            }
          })
        } else if (item.order_list_status_id === 2) {
          const order_list_status_id = 4
          const orderListObj = { order_list_status_id }
          orderListApi.update(order_list_id, orderListObj).then(() => {
            this.clear()
          }).then(() => {
            this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'ทำอาหารเสร็จสิ้น' })
          })
        }
      })
    },
    cancelOrder (item) {
      this.$refs.cancelOrderListModal.show().then((res) => {
        this.loading = true
        const orderListObj = { ...item, order_list_status_id: 3, Chef_Note: res }
        orderListApi.update(orderListObj.id ,orderListObj).then(() => {
          this.fetchData()
          this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'ยกเลิกออร์เดอร์สำเร็จ' })
        }).catch((error) => {
          console.log('error', error)
          this.loading = false
          this.sweatAlert({ position: this.$vuetify.breakpoint.xs ? 'top' : 'top-end', title: 'มีบางอย่างผิดพลาด', icon: 'error' })
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
    fetchFilterTab (tab) {
      if (Number(tab) === 0) {
        this.fetchID1(this.$store.getters.getCurrentPage)
      } else if (Number(tab) === 1) {
        this.fetchID2(this.$store.getters.getCurrentPage)
      } else if (Number(tab) === 2) {
        this.fetchID3(this.$store.getters.getCurrentPage)
      } else {
        this.fetchID4(this.$store.getters.getCurrentPage)
      }
    },
    changePage (event) {
      this.$store.commit('setCurrentPage', event)
      this.fetchFilterTab(this.tab)
    },
    clear () {
      this.$store.commit('setCurrentPage', 1)
      this.fetchData(this.$store.getters.getCurrentPage)
    },
    async startCountdown (orderListId, startTime, countdownDuration) {
      const db = await getFirestore()
      const countdownRef = await doc(db, 'orders', orderListId.toString())
      await setDoc(countdownRef, {
        order_id: orderListId,
        start_time: startTime,
        countdown_duration: countdownDuration
      })

      // สร้าง interval เพื่ออัปเดตค่าเวลาในเอกสารทุกๆ 1 วินาที
      const intervalId = await setInterval(() => {
        getDoc(countdownRef).then((doc) => {
          if (doc.exists) {
            const data = doc.data()
            const currentTime = Date.now()
            const startTime = data && data.start_time ? data.start_time : 0
            const countdownDuration = data && data.countdown_duration ? data.countdown_duration : 0
            const elapsedTime = currentTime - startTime

            // คำนวณเวลาที่เหลือใน countdown
            const remainingTime = Math.max(countdownDuration - elapsedTime, 0)

            // อัปเดตค่าเวลาในเอกสาร
            updateDoc(countdownRef, { remaining_time: remainingTime })

            // หยุด interval เมื่อ countdown เสร็จสิ้น
            if (remainingTime <= 0) {
              clearInterval(intervalId)
            }
          }
        })
      }, 10000) // อัปเดตทุกๆ 1 วินาที
    }
  }
}
</script>

<style lang="scss">
// ต้องมี comment เนื่องจากเชื่อมกับ scss
.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) >
.v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) >
.v-slide-group__prev {
  display: none;
  visibility: hidden;
}
</style>

<template>
  <div>
    <headerLayout title="จัดการเวลาทำอาหาร" name-btn="เพิ่มเวลาทำอาหาร" @click="addCountdown" />
    <section id="content">
      <v-container class="white rounded-lg pa-6">
        <v-row no-gutters>
          <v-col cols="12" sm="5">
            <v-form @submit.prevent="searchData">
              <v-text-field v-model="search" class="mb-sm-5" prepend-inner-icon="mdi-magnify" label="ค้นหาเวลาทำอาหาร" placeholder="กรุณาระบุคำค้นหา" hide-details outlined />
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
          <template #time="{ item }">
            <span>{{ item.time }} นาที</span>
          </template>
          <template #created_at="{ item }">
            <span>{{ formatDate(item.created_at)  }}</span>
          </template>
          <template #updated_at="{ item }">
            <span>{{ formatDate(item.updated_at) }}</span>
          </template>
          <template #manage="{ item }">
            <v-btn class="mr-1 mr-sm-0 mr-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : yellow`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="editOrderListStatus(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn class="ml-1 ml-sm-0 ml-md-1 rounded-lg" :color="`${!$vuetify.breakpoint.xs} : primary`" :icon="!$vuetify.breakpoint.xs" :x-small="!$vuetify.breakpoint.xs" :large="$vuetify.breakpoint.xs" elevation="0" :dark="$vuetify.breakpoint.xs" @click="deleteOrderListStatus(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>
        </flexibleTable>
      </v-container>
      <pagination :pageCount="lastPage" @onChangePage="changePage" no-shadow />
    </section>
    <countdownModal ref="countdownModal" />
    <confirmModal ref="confirmModal" icon="mdi-trash-can" />
  </div>
</template>

<script>
import countdownApi from '@/api/countdownApi'
import headerLayout from '@/components/backend/layout/header'
import flexibleTable from '@/components/backend/table/flexibleTable'
import pagination from '@/components/backend/pagination'
import confirmModal from '@/components/backend/modal/confirm'
import countdownModal from '@/components/backend/modal/orderList/countdownModal'
import { mixins } from '@/plugins/mixins'
export default {
  name: 'OrderStatusManagementPage',
  components: {
    headerLayout,
    flexibleTable,
    pagination,
    confirmModal,
    countdownModal
  },
  mixins:[mixins],
  data () {
    return {
      headers: [
        { text: 'ลำดับ', align: 'start', value: 'index', width: '5%' },
        { text: 'เวลาทำอาหาร', align: 'center', value: 'time', width: '15%' },
        { text: 'สร้างเมื่อ', align: 'center', value: 'created_at', width: '15%' },
        { text: 'อัพเดดล่าสุด', align: 'center', value: 'updated_at', width: '10%' },
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
      countdownApi.getAndCount(pageNumber).then((res) => {
        this.items = res.result.data
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
    searchDataOnChangePage (pageNumber) {
      this.loading = true
      if (this.search) {
        countdownApi.search(this.search, pageNumber).then((res) => {
          this.items = res.result.data
          this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
          this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
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
        countdownApi.search(this.search).then((res) => {
          this.items = res.result.data
          this.$store.commit('setCurrentPage', res.result.meta ? res.result.meta.current_page: res.result.current_page)
          this.perPage = res.result.meta ? res.result.meta.per_page: res.result.per_page
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
    addCountdown () {
      this.$refs.countdownModal.show().then((res) => {
        countdownApi.create(res).then(() => {
          if (!this.search) {
            this.fetchData(this.$store.getters.getCurrentPage)
          } else {
            this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
          }
        }).catch((error) =>{
          console.log('error', error)
        })
      })
    },
    editOrderListStatus (orderStatusObj) {
      this.$refs.countdownModal.show(orderStatusObj).then((res) => {
        countdownApi.update(orderStatusObj.id, res).then(() => {
          if (!this.search) {
            this.fetchData(this.$store.getters.getCurrentPage)
          } else {
            this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
          }
        }).catch((error) =>{
          console.log('error', error)
        })
      })
    },
    deleteOrderListStatus (orderStatusObj) {
      const text = `คุณต้องการลบ${orderStatusObj.Order_Status_Name}หรือไม่`
      this.$refs.confirmModal.show(orderStatusObj, text).then((res) => {
        countdownApi.delete(res.id).then(() => {
          if (!this.search) {
            this.fetchData(this.$store.getters.getCurrentPage)
          } else {
            this.searchDataOnChangePage(this.$store.getters.getCurrentPage)
          }
        }).catch((error) =>{
          console.log('error', error)
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
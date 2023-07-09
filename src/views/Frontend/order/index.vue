<template>
  <div>
    <progressLoaderComponent v-if="loading" fullScreen />
    <div v-else>
      <section id="header">
        <div class="pt-6 px-6">
          <h1 class="primary--text font-weight-regular mb-4">คำสั่งซื้อ</h1>
        </div>
      </section>
      <section id="content">
        <v-tabs v-model="tab" show-arrows background-color="transparent">
          <v-tab v-for="(item, index) in orderListStatus" :key="`order-status-${index}`" @click="selectTab(index, tab)">{{ item.Order_List_Status_Name }}</v-tab>
            <v-tab-item v-for="n in orderListStatus.length" :key="n">
              <v-row v-if="orderListFilter && orderListFilter.length > 0" class="background w-100 ma-0 pt-4 pb-16">
                <v-col v-for="item in orderListFilter" :key="`order-list-${item.id}`" class="background px-6 pb-0" cols="12">
                  <menuCardComponent
                    :image="item.Food.Food_Image"
                    :name="item.Food.Food_Name"
                    :description="item.Food.Food_Description"
                    :total-price="item.Price"
                    :quantity="item.Amount"
                    :to="item.id"
                    :detail-menu="{ ...item, index: queue(item.id) }"
                    width="100%"
                    height="100%"
                    horizontal
                    name-slug="detail"
                    link
                  />
                </v-col>
              </v-row>
              <v-row v-else class="background w-100 ma-0">
                <div>
                  <div class="d-flex justify-center align-center h-70vh w-100vw">
                    <span class="text-h4 primary--text">ไม่พบรายการอาหาร</span>
                  </div>
                </div>
              </v-row>
            </v-tab-item>
        </v-tabs>
      </section>
    </div>
  </div>
</template>

<script>
// Api
import orderListApi from '@/api/orderListApi'
import orderListStatusApi from '@/api/orderListStatusApi'
// components
import progressLoaderComponent from '@/components/progressLoader'
import menuCardComponent from '@/components/card/menuCard'
export default {
  name: 'OrderPage',
  components: { progressLoaderComponent, menuCardComponent },
  data () {
    return {
      tab: null,
      orderLists: [],
      orderListsForFilter: [],
      orderListStatus: [],
      loading: true
    }
  },
  computed: {
    orderListFilter () {
      const key = this.tab + 1
      if (this.orderListsForFilter && this.orderListsForFilter.length > 0) {
        switch (key) {
        case 1:
          return this.orderListsForFilter.filter((item) => item.order_list_status_id === 1)
        case 2:
          return this.orderListsForFilter.filter((item) => item.order_list_status_id === 2)
        case 3:
          return this.orderListsForFilter.filter((item) => item.order_list_status_id === 3)
        case 4:
          return this.orderListsForFilter.filter((item) => item.order_list_status_id === 4)
        }
      }
      return []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      await orderListApi.getAll().then((res) => {
        const userStorage = localStorage.getItem('user')
        const userStorageJSON = userStorage ? JSON.parse(userStorage) : false
        const userID = userStorageJSON ? userStorageJSON.id : false
        const username = userStorageJSON ? userStorageJSON.username : false
        this.orderLists = res.data
        this.orderListsForFilter = res.data.filter(element => (element.user.id === userID) && (element.user.username === username))
      })
      await orderListStatusApi.getAll().then((res) => {
        this.orderListStatus = res.data
        this.loading = false
      })
    },
    selectTab (index, tab) {
      if (index !== tab) {
        this.fetchData()
      }
    },
    queue (itemID) {
      const queue = this.orderLists.findIndex(element => element.id === itemID)
      return queue
    }
  }
}
</script>

<style scoped lang="scss">
  // ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
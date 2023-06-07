<template>
  <div>
    <section id="header">
      <div class="pt-6 px-6">
        <h1 class="primary--text font-weight-regular mb-4">คำสั่งซื้อ</h1>
      </div>
    </section>
    <section id="content">
      <v-tabs v-model="tab" show-arrows background-color="transparent">
        <v-tab v-for="(item, index) in orderListStatus" :key="`order-status-${index}`">{{ item.Order_List_Status_Name }}</v-tab>
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
                  :detail-menu="item"
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

    <!-- Group Order -->
    <!-- <section id="content">
      <v-tabs v-model="tab" show-arrows background-color="transparent">
        <v-tab v-for="(item, index) in orderStatus" :key="index">{{ item.Order_Status_Name }}</v-tab>
          <v-tab-item v-for="n in orderStatus.length" :key="n">
            <v-row v-if="orderFilter.length > 0" class="background w-100 ma-0 pt-4 pb-16">
              <v-col class="background px-6 pb-0" v-for="(order, index) in orderFilter" :key="index" cols="12">
                <menuCardComponent
                  image="stamp-order.png"
                  :name="`order id ${order.id}`"
                  :description="formatDate(order.created_at)"
                  :total-price="calculate(order.Order_List)"
                  :to="order.id"
                  width="100%"
                  height="100%"
                  horizontal
                  name-slug="order"
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
    </section> -->
  </div>
</template>

<script>
// Api
import orderListApi from '@/api/orderListApi'
import orderListStatusApi from '@/api/orderListStatusApi'
// components
import menuCardComponent from '@/components/card/menuCard.vue'

export default {
  name: 'OrderPage',
  components: { menuCardComponent },
  data () {
    return {
      tab: null,
      orderLists: [],
      orderListStatus: []
    }
  },
  computed: {
    orderListFilter () {
      const key = this.tab + 1
      if (this.orderLists && this.orderLists.length > 0) {
        switch (key) {
        case 1:
          return this.orderLists.filter((item) => item.order_list_status_id === 1)
        case 2:
          return this.orderLists.filter((item) => item.order_list_status_id === 2)
        case 3:
          return this.orderLists.filter((item) => item.order_list_status_id === 3)
        case 4:
          return this.orderLists.filter((item) => item.order_list_status_id === 4)
        }
      }
      return []
    }
  },
  //   orderFilter () {
  //     const key = this.tab + 1
  //     if (this.orders.length > 0) {
  //       switch (key) {
  //       case 1:
  //         return this.orders.filter((res) => res.order_status_id === 1)
  //       case 2:
  //         return this.orders.filter((res) => res.order_status_id === 2)
  //       case 3:
  //         return this.orders.filter((res) => res.order_status_id === 3)
  //       case 4:
  //         return this.orders.filter((res) => res.order_status_id === 4)
  //       }
  //     }
  //     return []
  //   }
  // },
  async mounted () {
    await this.fetchData()
  },
  methods: {
    fetchData () {
      orderListApi.getAll().then((res) => {
        this.orderLists = res.data
      })
      orderListStatusApi.getAll().then((res) => {
        this.orderListStatus = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
  // ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
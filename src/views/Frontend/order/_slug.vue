<template>
  <div>
    <section id="header">
      <div class="pt-6 px-6">
        <h1 class="primary--text font-weight-regular mb-2">รายละเอียดออร์เดอร์</h1>
      </div>
    </section>

    <section id="content">
      <v-row class="background w-100 ma-0">
        <div v-if="orderList.length > 0" class="background pt-4 px-6 pb-16">
          <v-col v-for="(item, index) in orderList" :key="index" cols="12" class="pb-0">
            <menuCardComponent
              :image="item.Food.Food_Image"
              :name="item.Food.Food_Name"
              :description="item.Food.Food_Description"
              :total-price="item.Price"
              :quantity="item.Amount"
              :to="item.Food.food_id"
              :detail-menu="item"
              width="100%"
              height="100%"
              horizontal
              name-slug="detail"
              link
            />
          </v-col>
        </div>
      </v-row>
    </section>
  </div>
</template>

<script>
// Api
// import orderApi from '@/api/orderApi'
import orderListApi from '@/api/orderListApi'
// components
import menuCardComponent from '@/components/card/menuCard.vue'
export default {
  name: 'OrderSlugPage',
  components: { menuCardComponent },
  data () {
    return {
      orderList: []
    }
  },
  computed: {
  },
  async mounted () {
    await this.fetchData()
  },
  methods: {
    fetchData () {
      // orderApi.getOne(this.$route.params._slug).then((res) => {
      //   this.orderList = res.data.Order_List
      // })
      orderListApi.getOne(this.$route.params._slug).then((res) => {
        this.orderList = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
  // ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
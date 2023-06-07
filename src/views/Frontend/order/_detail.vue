<template>
  <div>
    <section id="header" class="px-6 pt-6 pb-0">
      <h1 class="primary--text font-weight-regular">ตรวจสอบรายการอาหาร</h1>
    </section>
    <section id="body" class="mb-16 px-6 pt-6 pb-6">
      <detailCardComponent :items="item" />
    </section>
    <section id="navigation" v-if="item && item.order_list_status_id !== 3">
      <v-bottom-navigation class="d-flex flex-column elevation-0 px-5" color="primary" fixed >
          <div class="d-flex justify-center align-center w-100">
            <v-btn
              color="primary"
              class="rounded"
              block
              @click="cancelMenu"
            >
              <span class="white--text text-subtitle-1 font-weight-regular"> ยกเลิก </span>
            </v-btn>
          </div>
      </v-bottom-navigation>
    </section>
  </div>
</template>

<script>
// API
import orderListApi from '@/api/orderListApi'
// mapState
import { mapState } from 'vuex'
// Components
import detailCardComponent from '../../../components/card/detailCard.vue'
export default {
  name: 'DetailOrderPage',
  components: {
    detailCardComponent
  },
  data () {
    return {
      item: null
    }
  },
  computed: {
    ...mapState([ 'detail' ])
  },
  mounted () {
    this.item = this.detail
  },
  methods: {
    goToEditMenu () {
      this.$router.push(`/food-truck/_food_slug/${this.item.Food.food_id}`)
    },
    cancelMenu () {
      const id = this.item.id
      const obj = {
        ...this.item,
        order_list_status_id: 3
      }
      orderListApi.update(id, obj).then(() => {
        this.$router.back()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
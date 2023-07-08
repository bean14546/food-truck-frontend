<template>
  <div>
    <section v-if="items">
      <section id="header" class="px-6 pt-6 pb-0">
        <h1 class="primary--text font-weight-regular">ตรวจสอบรายการอาหาร</h1>
      </section>
      <section id="body" class="mb-16 px-6 pt-6 pb-6">
        <detailCardComponent :items="items" />
      </section>
      <section id="navigation">
        <v-bottom-navigation class="d-flex flex-column elevation-0 px-5" height="100px" color="primary" fixed >
          <div class="d-flex justify-center align-center w-100">
            <v-btn
              color="secondary"
              class="rounded"
              block
              @click="cancelMenu"
            >
              <span class="dark--text text-subtitle-1 font-weight-regular"> ยกเลิกเมนูนี้ </span>
            </v-btn>
          </div>
        </v-bottom-navigation>
      </section>
    </section>
    <section v-else>
      <div class="h-100vh d-flex justify-center align-center">
        <p class="primary--text text-center mb-0"> ไม่พบข้อมูล </p>
      </div>
    </section>
  </div>
</template>

<script>
// mapState
import { mapState } from 'vuex'
// Components
import detailCardComponent from '@/components/card/detailCard.vue'
export default {
  name: 'DetailCartPage',
  components: {
    detailCardComponent
  },
  data () {
    return {
      items: null
    }
  },
  computed: {
    ...mapState([ 'detail' ])
  },
  mounted () {
    this.items = {
      Food: this.detail.food,
      Options: this.detail.optionSelected.map((item) => {
        const obj = {
          Option_Name: item.Option_Name,
          Option_Details: item
        }
        return obj
      }),
      Topping: this.detail.toppingSelected,
      Amount: this.detail.quantity,
      Note: this.detail.note,
      isTakeaway: this.detail.isTakeaway,
      Price: this.detail.total
    }
  },
  methods: {
    async cancelMenu () {
      await this.$store.commit('deleteOrder', this.detail.index)
      await this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

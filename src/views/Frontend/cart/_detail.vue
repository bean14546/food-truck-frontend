<template>
  <div>
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
              color="primary"
              class="rounded mb-1"
              block
              @click="goToEditMenu"
            >
              <span class="white--text text-subtitle-1 font-weight-regular"> แก้ไข </span>
            </v-btn>
          </div>
          <div class="d-flex justify-center align-center w-100">
            <v-btn
              color="secondary"
              class="rounded"
              block
              @click="cancelMenu"
            >
              <span class="dark--text text-subtitle-1 font-weight-regular"> ยกเลิก </span>
            </v-btn>
          </div>
      </v-bottom-navigation>
    </section>
  </div>
</template>

<script>
// mapState
import { mapState } from 'vuex'
// Components
import detailCardComponent from '../../../components/card/detailCard.vue'
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
      Price: this.detail.total
    }
  },
  methods: {
    goToEditMenu () {
      console.log('edit')
      // this.$router.push(`/food-truck/_food_slug/${this.items.Food.food_id}`)
    },
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
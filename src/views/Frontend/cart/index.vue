<template>
  <div>
    <section id="header">
      <div class="pt-6 px-6">
        <h1 class="primary--text font-weight-regular mb-4">ตะกร้าสินค้า</h1>
      </div>
    </section>
    <section v-if="cart && cart.length > 0">
      <section id="content">
        <div class="pt-6 px-6 mb-16">
          <v-row>
            <v-col v-for="(item, index) in cart" :key="index" cols="12" class="pb-0">
              <menuCardComponent :food="item.food" :quantity="item.quantity" :total-price="item.total" :to="item.food.id" width="100%" height="100%" name-slug="detail_food_in_cart" :detail-menu="{...item, index: index}" horizontal />
            </v-col>
          </v-row>
        </div>
      </section>
    </section>
    <section v-else>
      <div class="h-70vh d-flex justify-center align-center">
        <p class="primary--text text-center mb-0"> ไม่พบอาหารในตะกร้า </p>
      </div>
    </section>
    <section id="navigation">
      <v-bottom-navigation class="d-flex align-center elevation-0 px-6" fixed>
        <v-btn class="rounded-lg" color="primary" block :disabled="!total" @click="orderNow">
          <p class="mb-0">
            <span v-if="total" class="white--text font-weight-light">
              สั่งเลย
            </span>
            <span class="white--text font-weight-light">
              {{ total ? total : 'ยังไม่พบสินค้าในตะกร้า' }}
            </span>
            <span v-if="total" class="white--text font-weight-light">
              บาท
            </span>
          </p>
        </v-btn>
      </v-bottom-navigation>
    </section>
  </div>
</template>

<script>
// Api
import orderListApi from '@/api/orderListApi'
import orderListOptionApi from '@/api/orderListOptionApi'
import orderListToppingApi from '@/api/orderListToppingApi'
import userApi from '@/api/userApi'
// components
import menuCardComponent from '@/components/card/menuCard.vue'
// map state
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'CartPage',
  components: { menuCardComponent },
  computed: {
    ...mapState([ 'cart' ]),
    ...mapGetters([ 'total' ])
  },
  methods: {
    async orderNow () {
      if (!localStorage.getItem('user')) {
        const username = await Math.random().toString(36).slice(2)
        await userApi.create({ username }).then((res) => {
          const user = {
            id: res.data.id,
            username: res.data.username
          }
          localStorage.setItem('user', JSON.stringify(user))
        }).then(() => {
          const user = localStorage.getItem('user')
          const userJSON = JSON.parse(user)
          this.createOrder(userJSON.id)
        })
      } else {
        // เทียบ username ใน localStorage กับ DB ว่ามีและตรงกัน" หรือไม่ ถ้ามีและตรงกันให้ส่ง userId ให้กับ order
        const user = localStorage.getItem('user')
        const userJSON = JSON.parse(user)
        await userApi.getOne(userJSON.id).then((res) => {
          if (res.data && (res.data.id === userJSON.id)) {
            this.createOrder(res.data.id)
          } else {
            // อย่าลืม หาวิธีแก้
            console.log('Username in local storage has not changed')
          }
        })
      }
    },
    async createOrder (userId) {
      await this.cart.forEach(foodInTheCart => {
        const orderList = {
          food_id: foodInTheCart.food.id,
          order_list_status_id: 1,
          Amount: foodInTheCart.quantity,
          Price: foodInTheCart.total,
          Note: foodInTheCart.note,
          user_id: userId,
          isTakeaway: foodInTheCart.isTakeaway
        }
        orderListApi.create(orderList).then((orderListResponse) => {
          foodInTheCart.optionSelected.forEach(optionSelected => {
            const orderListOption = {
              order_list_id: orderListResponse.data.id,
              option_id: optionSelected.option_id,
              option_detail_id: optionSelected.id
            }
            orderListOptionApi.create(orderListOption)
          })
          foodInTheCart.toppingSelected.forEach(toppingSelected => {
            const orderListTopping = {
              order_list_id: orderListResponse.data.id,
              topping_id: toppingSelected.id
            }
            orderListToppingApi.create(orderListTopping)
          })
        }).catch((error) => {
          console.log('error', error)
        })
      })
      await this.$store.commit('clearCart')
      await this.$router.push('/food-truck')
    }
  }
}
</script>

<style lang="scss" scoped>
  // ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

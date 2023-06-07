<template>
  <v-app class="background">
    <router-view />
    <v-bottom-navigation v-model="value" color="primary" fixed>
      <v-btn
        v-for="(item, index) in buttonObj"
        :key="index"
        :value="item.value"
        height="100%"
        color="white"
        @click="goPage(item.path)"
      >
        <span>{{ item.name }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  name: 'FrontendLayout',
  data () {
    return {
      value: '',
      buttonObj: [
        {
          value: 'home',
          name: 'หน้าแรก',
          icon: 'mdi-home-outline',
          path: '/food-truck'
        },
        {
          value: 'food',
          name: 'สั่งอาหาร',
          icon: 'mdi-food-off-outline',
          path: '/food-truck/food'
        },
        {
          value: 'cart',
          name: 'ตะกร้า',
          icon: 'mdi-cart-outline',
          path: '/food-truck/cart'
        },
        {
          value: 'order',
          name: 'คำสั่งซื้อ',
          icon: 'mdi-clock-time-five-outline',
          path: '/food-truck/order'
        }
      ]
    }
  },
  methods: {
    goPage (path) {
      this.$router.push(path).catch(()=>{})
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
<template>
  <v-app class="background">
    <router-view></router-view>
    <v-bottom-navigation v-model="value" color="primary" fixed>
      <v-btn v-for="(item, index) in buttonObj" :key="index" :value="item.value" height="100%" color="white">
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
          path: ''
        },
        {
          value: 'food',
          name: 'สั่งอาหาร',
          icon: 'mdi-food-off-outline',
          path: ''
        },
        {
          value: 'cart',
          name: 'ตะกร้า',
          icon: 'mdi-cart-outline',
          path: ''
        },
        {
          value: 'order',
          name: 'คำสั่งซื้อ',
          icon: 'mdi-clock-time-five-outline',
          path: ''
        }
      ]
    }
  }
}
</script>

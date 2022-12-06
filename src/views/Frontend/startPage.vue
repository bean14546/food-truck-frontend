<template>
  <div>
    <div class="d-flex flex-column justify-center primary--text pa-8 h-100">
      <h1 class="font-weight-regular">ยินดีต้อนรับ.</h1>
      <p class="text-subtitle-3 mb-2">ยินดีต้อนรับเข้าสูระบบสั่งอาหารสำหรับ</p>
      <p class="text-subtitle-3">รถ Food truck.</p>
    </div>
    <v-bottom-navigation class="elevation-0" fixed>
      <div class="px-8 w-100">
        <v-btn class="rounded-lg" color="primary" block @click="start">
          <span class="white--text font-weight-light">
            เข้าใชงานที่นี่
          </span>
        </v-btn>
      </div>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  name: 'StartPage',
  layout: 'BlankLayout',
  methods: {
    start () {
      this.$router.push('/foodtruck')
    }
  }
}
</script>

<style scoped>
.theme--light.v-bottom-navigation {
    background-color: rgba(0, 0, 0, 0) !important;
}
.h-100 {
  height: 100vh;
}
</style>
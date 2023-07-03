<template>
  <v-container fill-height>
    <v-btn color="primary" elevation="0" text absolute top right small @click="goToAdminPage">สำหรับผู้จัดการร้าน</v-btn>
    <section id="header" class="primary--text pa-5 w-100">
      <v-img width="100px" :src="require('../../../style/assets/image/logo-general.png')" />
      <h1 class="font-weight-regular">ยินดีต้อนรับ.</h1>
      <p class="text-subtitle-3 mb-2">ยินดีต้อนรับเข้าสูระบบสั่งอาหารสำหรับ</p>
      <p class="text-subtitle-3 mb-2">รถ Food truck.</p>
    </section>

    <section id="navigation">
      <v-bottom-navigation class="d-flex align-center elevation-0 px-6" background-color="transparent" fixed>
        <v-btn class="rounded-lg" color="primary" height="36px" block dense @click="start">
          <span class="white--text font-weight-light">
            เข้าใชงานที่นี่
          </span>
        </v-btn>
      </v-bottom-navigation>
    </section>
  </v-container>
</template>

<script>
export default {
  name: 'StartPage',
  layout: 'BlankLayout',
  methods: {
    start () {
      this.$router.replace('/food-truck')
    },
    goToAdminPage () {
      this.$router.push({ name : 'login' })
    }
  }
}
</script>

<style lang="scss" scoped>
  // ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

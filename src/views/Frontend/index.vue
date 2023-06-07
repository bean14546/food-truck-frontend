<template>
  <v-container fill-height>
    <v-btn color="primary" elevation="0" text absolute top right small @click="goToAdminPage">สำหรับผู้จัดการร้าน</v-btn>
    <section id="header" class="primary--text pa-5">
      <h1 class="font-weight-regular">ยินดีต้อนรับ.</h1>
      <p class="text-subtitle-3 mb-2">ยินดีต้อนรับเข้าสูระบบสั่งอาหารสำหรับ</p>
      <p class="text-subtitle-3 mb-2">รถ Food truck.</p>
    </section>

    <section id="navigation">
      <v-bottom-navigation class="elevation-0" background-color="transparent" fixed>
        <div class="align-self-center px-8 w-100">
          <v-btn class="rounded-lg" color="primary" block @click="start">
            <span class="white--text font-weight-light">
              เข้าใชงานที่นี่
            </span>
          </v-btn>
        </div>
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
<template>
  <v-app-bar
    elevation="0"
    color="white"
    app
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer" />
    <v-spacer />
      <v-avatar class="rounded-lg mr-2" tile>
        <img src="https://cdn.vuetifyjs.com/images/john.jpg" />
      </v-avatar>
    <div>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-toolbar-title class="text-subtitle-1 grey--text">{{ subTitle }}</v-toolbar-title>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBarLayoutComponent',
  props: {
    title: {
      default: 'Admin Food Truck',
      type: String
    },
    subTitle: {
      default: 'ผู้ดูแลระบบ',
      type: String
    }
  },
  methods: {
    toggleDrawer () {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
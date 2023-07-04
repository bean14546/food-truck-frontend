<template>
  <div>
    <v-avatar
      class="elevation-0"
      :color="color"
      size="80"
      @click="goToCategory(category.id)"
    >
      <v-img :src="category.Category_Image" />
    </v-avatar>
  </div>
</template>

<script>
export default {
  name: 'CategoryCardComponent',
  props: {
    color: {
      type: String,
      default: 'secondary'
    },
    to: {
      type: [String, Number],
      default: 'not-found'
    },
    category: {
      type: Object,
      default: () => {
        return {
          id: null,
          Category_Name: null,
          Category_Image: null
        }
      }
    }
  },
  methods: {
    goToCategory (id) {
      this.$router.push({ path: '/food-truck/food', hash: `${id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

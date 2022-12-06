<template>
  <div>
    <v-card
      class="d-flex justify-center align-center rounded-pill elevation-0"
      :color="color"
      width="80px"
      height="80px"
    >
      <v-img :src="category.Category_Image" />
    </v-card>
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
  }
}
</script>

<style>
</style>

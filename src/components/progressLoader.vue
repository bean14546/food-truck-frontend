<template>
  <div :class="fullScreen ? 'h-100vh d-flex justify-center align-center' : ''">
    <v-progress-circular indeterminate color="primary" />
  </div>
</template>

<script>
export default {
  props: {
    fullScreen : {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
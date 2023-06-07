<template>
  <section id="header">
    <div class="d-flex align-center justify-space-between mt-3 mb-3" :class="noneBtn ? 'justify-center' : ''" :style="noneBtn && $vuetify.breakpoint.xs ? 'height: 44px' : 'height: 56px'">
      <span class="text-h6 text-sm-h5 font-weight-bold"> {{ title }} </span>
      <v-btn v-if="!noneBtn" class="rounded-lg" color="primary" elevation="0" :small="$vuetify.breakpoint.xs" :height="$vuetify.breakpoint.xs ? 44 : 56" @click="clickBtn">
        <v-icon left> {{ iconBtn }} </v-icon>
        <span> {{ nameBtn }} </span>
      </v-btn>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeaderLayoutComponent',
  props: {
    title: {
      default: '',
      type: String
    },
    noneBtn: {
      default: false,
      type: Boolean
    },
    iconBtn: {
      default: 'mdi-plus',
      type: String
    },
    nameBtn: {
      default: '',
      type: String
    }
  },
  methods: {
    clickBtn () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
//
</style>
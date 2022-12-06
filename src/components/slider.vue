<template>
  <v-slide-group>
    <v-slide-item
      v-for="(item, index) in items" :key="index"
    >
      <slot name="item" :item="item" :index="index" />
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  name: 'SliderComponent',
  props: {
    items: {
      type: Array,
      default: null
    }
  }
}
</script>

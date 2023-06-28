<template>
  <v-card class="pa-6" elevation="15" rounded="lg">
    <v-card-text v-if="!loading" class="font-weight-medium text-h6 d-flex pa-2">
      <p class="mb-0"> {{ item.name }} </p>
      <v-spacer />
      <p class="mb-0">
        <span class="mr-2">{{ item.value }}</span>
        <span>{{ item.pronoun }}</span>
      </p>
    </v-card-text>
    <v-skeleton-loader v-else type="text" />
  </v-card>
</template>

<script>
export default {
  name: 'SummarizeDashboardComponent',
  props: {
    item: {
      type: [Object, Number],
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
</style>

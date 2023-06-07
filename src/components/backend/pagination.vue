<template>
  <v-row v-if="pageCount > 1">
    <v-col cols="12" class="d-flex justify-center mt-3">
      <v-pagination
        id="pagination"
        v-model="$store.state.currentPage"
        :class="`${noShadow } ? no-shadow`"
        color="primary"
        :disabled="isDisabled"
        :length="pageCount"
        @input="onReturnValue"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    noShadow: {
      default: true,
      type: Boolean
    },
    isDisabled: {
      default: false,
      type: Boolean
    },
    pageCount: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  mounted () {
    this.setPage()
  },
  methods: {
    onReturnValue () {
      this.$emit('onChangePage', this.$store.getters.getCurrentPage)
    },
    setPage () {
      if (!this.$store.getters.getCurrentPage) {
        this.$store.commit('setCurrentPage', 1)
      } else {
        this.$store.commit('setCurrentPage', Number(this.$route.query.currentPage))
      }
    }
  }
}
</script>

<style lang="scss">
#pagination {
  &.no-shadow {
    ul.v-pagination li{
      button {
        box-shadow: none !important;
      }
    }
  }
}
</style>
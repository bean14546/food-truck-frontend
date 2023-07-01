<template>
  <v-dialog v-model="dialog" ref="dialog" width="290px" persistent :return-value.sync="date">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field v-model="date" class="filter-input rounded-xl" color="primary" height="52" prepend-inner-icon="mdi-calendar" label="PICKER IN DIALOG" hide-details solo readonly v-bind="attrs" v-on="on" />
    </template>
    <v-date-picker v-model="date" scrollable :max="dateDefault">
      <v-spacer />
      <v-btn text color="primary" @click="dialog = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="dateFilter(date)"> OK </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  name: 'DateDialogComponent',
  data () {
    return {
      dialog: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateDefault: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    }
  },
  methods: {
    dateFilter (date) {
      this.$refs.dialog.save(date),
      this.$emit('dateFilter', date)
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-input {
  box-shadow:
    0px 8px 9px -5px rgba(0, 0, 0, 0.2),
    0px 15px 22px 2px rgba(0, 0, 0, 0.14),
    0px 6px 28px 5px rgba(0, 0, 0, 0.12) !important;
}
</style>

<template>
  <v-container v-if="show" class="pa-0" fluid>
    <v-list v-if="$vuetify.breakpoint.smAndUp">
      <v-list-item>
        <v-list-item-title> {{ name }} </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-layout class="d-flex justify-space-between">
            <v-flex
              v-for="(header, index) in headers"
              :key="`${header.title}-${index}`"
              tag="div"
              :style="`width: ${ header.width ? header.width : 'auto' }`"
              :class="`text-${header.align}`"
            >
              <span class="text-center mr-2" :class="header.truncate ? 'text-truncate' : ''">{{ header.text }}</span>
            </v-flex>
          </v-layout>
        </v-list-item-content>
      </v-list-item>
      <div v-for="(item, itemIndex) in items" :key="itemIndex" class="border">
        <v-list-item style="height: 48px">
          <v-list-item-content>
            <v-layout class="d-flex justify-space-between align-center grey--text text--darken-2">
              <v-flex
                v-for="(header, headerIndex) in headers"
                class="items px-2 mb-0"
                :key="headerIndex"
                :class="`${header.truncate ? 'text-truncate': ''} ${aligns(header.align)}`"
                :style="`width: ${ !header.width ? 'auto' : header.width }`"
                tag="div"
              >
                <slot :name="header.value" :item="item" :index="itemIndex">
                  <span class="lineClamp">{{ item[header.value] }}</span>
                </slot>
              </v-flex>
            </v-layout>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
      </div>
    </v-list>

    <!-- Mobile -->
    <v-card v-else rounded="lg" :elevation="elevation" :outlined="outlined">
      <!-- No Data -->
      <v-card-text v-if="!items || (items && items.length < 1)">
        <p class="text-center mb-0"> ไม่พบข้อมูล </p>
      </v-card-text>
      <!-- List Items -->
      <template v-else>
        <v-card-text v-for="(item, itemIndex) in items" :key="itemIndex">
          <template v-for="(header, headerIndex) in headers">
            <v-flex v-if="!header.hideDataOnMobile" :key="headerIndex" class="items my-3" tag="div" :style="`width: ${ header.mobileWidth ?  header.mobileWidth : 'auto' }`">
              <span class="font-weight-bold mr-2" v-if="!header.hideHeaderOnMobile">{{ header.text }} :</span>
              <slot :name="header.value" :item="item" :index="itemIndex">
                <span class="grey--text text--darken-2">{{ item[header.value] }}</span>
              </slot>
            </v-flex>
          </template>
          <v-divider v-if="itemIndex + 1 !== items.length" style="border: 0.5px solid rgba(0, 0, 0, 0.2)" />
        </v-card-text>
      </template>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ListTableComponent',
  props: {
    name: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    elevation: {
      type: Number,
      default: 0
    }
  },
  methods: {
    aligns (key) {
      switch (key) {
      case 'left':
        return 'text-left'
      case 'right':
        return 'text-right'
      case 'center':
        return 'text-center'
      default:
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  //
</style>
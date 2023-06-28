<template>
  <div class="flexible-table-wrapper">
    <!-- Desktop Case -->
    <v-list v-if="$vuetify.breakpoint.smAndUp" class="overflow-hidden rounded-t-lg py-0" :elevation="elevation" :outlined="outlined">
      <!-- header -->
      <v-list-item class="primary" dark>
        <v-list-item-content>
          <v-layout class="d-flex justify-space-between">
            <v-flex
              v-for="(header, index) in headers"
              :key="`${header.title}-${index}`"
              tag="div"
              :style="`width: ${ header.width ? header.width : 'auto' }`"
              class="header-items"
              :class="`text-${header.align}`"
            >
              <span class="text-center mr-2" :class="header.truncate ? 'text-truncate' : ''">{{ header.text }}</span>
              <v-icon v-if="header.sortable" color="white" @click="sortBy(header.value)" small>{{ sortKey === header.value ? 'mdi-sort-descending' : 'mdi-sort-ascending' }}</v-icon>
            </v-flex>
          </v-layout>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <!-- loading -->
      <slot v-if="loading" name="loader">
        <div v-for="(skeleton, index) in 10" :key="`loader-${skeleton}`" class="border">
          <v-list-item :class="itemColor(false, index)">
            <v-list-item-content>
              <v-layout>
                <v-flex
                  v-for="(skeletonHeader, skeletonHeaderIndex) in headers"
                  :key="`${skeletonHeader}-${skeletonHeaderIndex}`"
                  :style="`width: ${ skeletonHeader.width ? skeletonHeader.width : 'auto' }`"
                >
                  <v-skeleton-loader :class="skeletonAligns(skeletonHeader.align)" max-width='64' height='14' type='text' />
                </v-flex>
              </v-layout>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
        </div>
      </slot>
      <!-- No Data -->
      <v-list-item v-else-if="!items || !(items.length > 0)">
        <v-list-item-content>
          <div class="darkGrey--text text-center"> ไม่พบข้อมูล </div>
        </v-list-item-content>
      </v-list-item>
      <!-- List Items -->
      <template v-if="(items && items.length > 0) && !loading">
        <div
          v-for="(item, itemIndex) in filteredItems"
          :key="itemIndex"
          class="border"
        >
          <v-hover :key="`item-${itemIndex}`" v-slot="{ hover }">
            <v-list-item :class="itemColor(hover, itemIndex)" style="height: 48px">
              <v-list-item-content>
                <v-layout class="grey--text text--darken-2 d-flex justify-space-between align-center">
                  <v-flex
                    v-for="(header, headerIndex) in headers"
                    class="items px-2 mb-0"
                    :key="headerIndex"
                    :class="`${header.truncate ? 'text-truncate': ''} ${aligns(header.align)}`"
                    :style="`width: ${ !header.width ? 'auto' : header.width }`"
                    tag="div"
                  >
                    <slot :name="header.value" :item="item" :index="itemIndex" :hover="hover">
                      <span class="lineClamp" :style="numberOfLines">{{ item[header.value] }}</span>
                    </slot>
                  </v-flex>
                </v-layout>
              </v-list-item-content>
            </v-list-item>
          </v-hover>
          <v-divider />
        </div>
      </template>
    </v-list>

    <!-- Mobile -->
    <v-card v-else rounded="lg" :elevation="elevation" :outlined="outlined">
      <v-card-text v-if="loading">
        <!-- Loading -->
        <div v-for="mSkt in 10" :key="mSkt">
          <v-skeleton-loader type="list-item-two-line" />
          <v-divider v-if="mSkt !== 10" />
        </div>
      </v-card-text>
      <!-- No Data -->
      <v-card-text v-else-if="!filteredItems || (filteredItems && filteredItems.length < 1)">
        <p class="text-center mb-0"> ไม่พบข้อมูล </p>
      </v-card-text>
      <!-- List Items -->
      <template v-else>
        <v-card-text v-for="(item, itemIndex) in filteredItems" :key="itemIndex">
          <template v-for="(header, headerIndex) in headers">
            <v-flex v-if="!header.hideDataOnMobile" :key="headerIndex" class="items my-3" tag="div" :style="`width: ${ header.mobileWidth ?  header.mobileWidth : 'auto' }`">
              <span class="font-weight-bold mr-2" v-if="!header.hideHeaderOnMobile">{{ header.text }} :</span>
              <slot :name="header.value" :item="item" :index="itemIndex">
                <span class="grey--text text--darken-2">{{ item[header.value] }}</span>
              </slot>
            </v-flex>
          </template>
          <v-divider v-if="itemIndex + 1 !== filteredItems.length" style="border: 0.5px solid rgba(0, 0, 0, 0.2)" />
        </v-card-text>
      </template>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'FlexibleTableComponent',
  props: {
    headers: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    elevation: {
      type: Number,
      default: 0
    },
    outlined: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      sortKey: '',
      sortStatus: false
    }
  },
  computed: {
    filteredItems () {
      const items = [...this.items]
      if (this.sortKey) {
        return this.sorting(items)
      } else {
        return items
      }
    },
    numberOfLines () {
      return '--line: 1'
    }
  },
  methods: {
    itemColor (hoverState, index) {
      if (!hoverState) {
        if (this.striped) {
          if (index % 2 === 0) {
            return ''
          } else {
            return 'lightGray'
          }
        } else {
          return ''
        }
      } else {
        return 'grey lighten-2'
      }
    },
    skeletonAligns (key) {
      switch (key) {
      case 'left':
        return 'mr-auto'
      case 'right':
        return 'ml-auto'
      case 'center':
        return 'mx-auto'
      default:
        return ''
      }
    },
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
    },
    sortBy (headerValue) {
      if (this.sortKey === headerValue) {
        this.sortKey = ''
      } else {
        this.sortKey = headerValue
      }
    },
    sorting (items) {
      const sortingItems = items.sort((a, b) => {
        const sortKeyA = a[this.sortKey]
        const sortKeyB = b[this.sortKey]
        if (typeof (sortKeyA) === 'string' && typeof (sortKeyB) === 'string') {
          if (this.sortStatus) {
            return sortKeyA.toUpperCase().localeCompare(sortKeyB)
          } else {
            return sortKeyB.toUpperCase().localeCompare(sortKeyA)
          }
        } else if (typeof (sortKeyA) === 'number' && typeof (sortKeyB) === 'number') {
          if (this.sortStatus) {
            return sortKeyA - sortKeyB
          } else {
            return sortKeyB - sortKeyA
          }
        } else {
          return 0
        }
      })
      return sortingItems
    }
  }
}
</script>

<style lang="scss" scoped>
.flexible-table-wrapper {
  .header-items, .items {
    cursor: default;
  }
}
.lineClamp {
  @include lineClamp(var(--line), 1.2rem);
}
.border {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
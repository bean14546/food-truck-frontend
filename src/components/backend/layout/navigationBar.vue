<template>
  <v-navigation-drawer
    v-model="toggle"
    :fixed="$vuetify.breakpoint.mdAndup"
    :temporary="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
    class="customized-sidebar"
    :color="backgroundColor"
    :width="width"
    :permanent="toggle"
    dark
    app
  >
    <template #prepend>
      <div v-if="!$vuetify.breakpoint.mdAndUp" class="text-right pt-2 pr-2">
        <v-btn icon @click="toggleDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-center text-h6">
          {{ title }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <div class="gradient-line" />

    <v-list class="mx-2" nav>
      <template v-for="(item, index) in items">
        <v-list-group
          v-if="item.group"
          :prepend-icon="item.icon"
          :key="`${item.group}-${index}`"
          class="group mt-3"
          active-class="active-state"
        >
          <template #activator>
            <v-list-item-content class="menu-item">
              <v-list-item-title>{{ item.group }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <template #prependIcon>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <template v-for="(subGroup, subGroupIndex) in item.items">
            <v-list-item
              v-if="!subGroup.group"
              :key="`${subGroup.title}-${subGroupIndex}`"
              active-class="active-state"
              :to="subGroup.route"
              class="sub-menu"
              color="white"
              link
              replace
            >
              <v-list-item-title class="primary--text">{{ subGroup.title }}</v-list-item-title>
            </v-list-item>
            <v-list-group
              v-else
              :key="`${subGroup.group}-${subGroupIndex}`"
              class="subGroup mt-3"
              active-class="active-state"
              no-action
              sub-group
            >
              <template #activator>
                <v-list-item-content class="menu-item">
                  <v-list-item-title>{{ subGroup.group }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="(subSubGroup, subSubGroupIndex) in subGroup.items" :key="`${subSubGroup.title}-${subSubGroupIndex}`"
                active-class="active-state"
                :to="subSubGroup.route"
                class="sub-menu"
                color="white"
                replace
              >
                <v-list-item-title class="primary--text">{{ subSubGroup.title }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-group>
        <v-list-item
          v-else
          :key="`${item.title}-${index}`"
          active-class="active-state"
          class="menu-item"
          :to="item.route"
          color="white"
          replace
          exact
          dense
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <template #append>
      <div class="ma-2">
        <v-btn block @click.stop="logout">
          <v-icon left>
            mdi-logout
          </v-icon>
          logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import authApi from '@/api/authApi'
export default {
  name: 'NavigationBarLayoutComponent',
  props: {
    title: {
      default: 'Back Office',
      type: String
    },
    backgroundColor: {
      default: 'primary',
      type: String
    },
    width: {
      default: '350px',
      type: [String, Number]
    },
    items: {
      default: null,
      type: Array
    }
  },
  data () {
    return {
      toggle: false
    }
  },
  methods: {
    toggleDrawer () {
      this.toggle = !this.toggle
    },
    logout () {
      const adminStorageEncoded = localStorage.getItem('admin')
      const adminStorageDecoded = adminStorageEncoded ? atob(adminStorageEncoded) : false
      const adminStorageJSON = adminStorageDecoded ? JSON.parse(adminStorageDecoded) : false
      const token = adminStorageJSON ? adminStorageJSON.token : false
      authApi.adminLogout(token).then(() => {
        localStorage.removeItem('admin')
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  &.active-state {
    background-color: white !important;
    color: $primary !important;
    border-radius: 8px;
    &:before {
      opacity: 0;
    }
  }
}
.sub-menu {
  &.active-state {
    background-color: white !important;
    color: $primary !important;
    border-radius: 8px;
    &:before {
      opacity: 0;
    }
  }
}
// custom css
.gradient-line {
  height: 1px;
  width: 100%;
  // background: red;
  background-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent 100%);
  margin: 24px 0;
}
.v-list-item--dense, .v-list--dense .v-list-item {
  min-height: 52px;
}
.v-list-item--dense .v-list-item__title {
  font-size: 1rem !important;
  font-weight: 400;
}
.v-list.mx-2 .v-list-group__items > .v-list-item {
  padding-left: 34px !important;
  min-height: 52px ;
  margin-left: 30px ;
  margin-right: -10px ;
  border-radius: 10px ;
}
.v-list .v-list-group.v-list-group--active {
  background-color: $secondary;
}
.v-list.mx-2 .v-list-group.v-list-group--active {
  padding-bottom: 15px;
  border-radius: 10px;
}
.v-list-item, .v-list-item .v-icon, .v-list-group .v-list-item__content, .v-list-group__header .v-icon {
  color: white !important;
}
.v-list-group--active .v-list-item__content, .v-list-group--active .v-list-item__icon .v-icon {
  color: $primary !important;
}
.v-list-item--active {
  color: $primary !important;
}
.v-list-item--active .v-icon {
  color: $primary !important;
}

</style>

<style lang="scss">
.subGroup > .v-list-group__header > .v-list-item__icon {
  margin-right: 8px !important;
}
.subGroup > .v-list-group__header > .v-list-item__icon > i {
  color: $primary !important;
}
.subGroup > .v-list-group__items {
  overflow: visible !important;
}
</style>
<template>
  <v-app class="secondary">
    <appBarComponent @toggle="toggleSidebar" />
    <navigationBarComponent v-model="drawer" ref="navigationBarComponent" :items="items" />
    <v-container>
      <router-view />
    </v-container>
  </v-app>
</template>

<script>
import appBarComponent from '@/components/backend/layout/appBar.vue'
import navigationBarComponent from '@/components/backend/layout/navigationBar.vue'
export default {
  name: 'BackendLayout',
  components: { appBarComponent, navigationBarComponent },
  data () {
    return {
      drawer: false,
      items: [
        { title: 'Dashboard', icon: 'mdi mdi-view-dashboard-outline', route: 'dashboard' },
        {
          group: 'ออเดอร์',
          icon: 'mdi mdi-order-bool-ascending-variant',
          items: [
            {
              title: 'จัดการออเดอร์',
              route: 'orderManagement'
            },
            {
              title: 'จัดการสถานะออเดอร์',
              route: 'orderStatusManagement'
            },
            {
              title: 'จัดการเวลาทำอาหาร',
              route: 'countdownManagement'
            }
          ]
        },
        {
          group: 'อาหาร',
          icon: 'mdi mdi-food-outline',
          items: [
            {
              title: 'จัดการอาหาร',
              route: 'foodManagement'
            },
            {
              title: 'จัดการหมวดหมู่อาหาร',
              route: 'categoryManagement'
            },
            {
              title: 'จัดการ Toppings',
              route: 'toppingManagement'
            },
            {
              group: 'Option',
              items: [
                {
                  title: 'จัดการ Options',
                  route: 'optionManagement'
                },
                {
                  title: 'จัดการรายละเอียด Options',
                  route: 'optionDetailManagement'
                }
              ]
            }
          ]
        },
        {
          group: 'วัตถุดิบ',
          icon: 'mdi mdi-shaker-outline',
          items: [
            {
              title: 'จัดการรายการวัตถุดิบ',
              route: 'ingredientsManagement'
            },
            {
              title: 'จัดการสต๊อก',
              route: 'stockManagement'
            },
            {
              title: 'จัดการหมวดหมู่ของวัตถุดิบ',
              route: 'groupManagement'
            },
            {
              title: 'จัดการหน่วยของวัตถุดิบ',
              route: 'unitManagement'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toggleSidebar () {
      this.$refs.navigationBarComponent.toggleDrawer()
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>
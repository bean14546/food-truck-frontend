<template>
  <div>
    <progressLoaderComponent v-if="loading" fullScreen />
    <div v-else>
      <section id="header">
        <v-card class="secondary" elevation="0">
          <v-img :src="require('../../../../style/assets/image/cover.jpg')" />
          <div class="header-management rounded-t-xl white">
            <v-card-title class="primary--text">หน้าสั่งอาหาร</v-card-title>
            <v-card-text>
              <v-autocomplete
                :items="food"
                placeholder="ค้นหา"
                background-color="lightGray"
                item-text="Food_Name"
                item-value="id"
                clearable
                hide-details
                hide-selected
                rounded
                dense
                filled
              >
                <template v-slot:prepend-inner>
                  <v-icon color="primary">mdi-magnify</v-icon>
                </template>
                <template v-slot:selection="data">
                  <v-avatar class="mr-2" size="30" left>
                    <v-img :src="data.item.Food_Image" />
                  </v-avatar>
                  <span>{{ data.item.Food_Name }}</span>
                </template>
                <template v-slot:item="data">
                  <v-list-item @click="goToSlug(data.item.id)">
                    <v-list-item-avatar>
                      <img :src="data.item.Food_Image" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ data.item.Food_Name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ data.item.Food_Description }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <span class="green--text"> {{ data.item.Food_Price }} บาท </span>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-card-text>
            <v-card-actions v-if="category.length > 0" class="pa-0">
              <v-tabs show-arrows>
                <v-tab v-for="(item, index) in category" :key="index" @click="scrollToCategory(item.id)">{{ item.Category_Name }}</v-tab>
              </v-tabs>
            </v-card-actions>
          </div>
        </v-card>
      </section>

      <section id="body">
        <div v-show="category.length > 0" class="mb-14">
          <template v-for="(item, index) in category">
            <v-row
              v-if="item.id !== 0"
              :key="`Category-${index}`"
              class="px-2 pb-4"
              :class="(index % 2 !== 0 ? 'secondary' : 'background')"
              :ref="`category-#${item.id}`"
              no-gutters
            >
              <v-col cols="12" class="pb-2 pl-2" :class="index > 0 ? 'pt-4' : ''">
                <p class="primary--text font-weight-regular text-h6 mb-0"> {{ item.Category_Name }} </p>
                <p class="grey--text font-weight-regular text-subtitle-1 mb-0"> {{ item.Category_Description }} </p>
              </v-col>
              <v-col v-for="(food, index) in item.Food" :key="`Food ${index}`" class="d-flex flex-column justify-center align-center" cols="6" sm="3" md="2">
                <menuCardComponent :food="food" width="160px" class="pa-2" name-slug="food" :to="food.id" />
              </v-col>
            </v-row>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// API
import foodApi from '@/api/foodApi'
import categoryApi from '@/api/categoryApi'
// components
import menuCardComponent from '@/components/card/menuCard.vue'
import progressLoaderComponent from '@/components/progressLoader'
export default {
  name: 'FoodPage',
  components: { progressLoaderComponent, menuCardComponent },
  data () {
    return {
      loading: true,
      food: [],
      category: []
    }
  },
  async mounted () {
    await this.fetchData()
    const hash = this.$route.hash.split('')
    if (hash.length > 0) {
      await this.scrollToCategory(Number(hash[1]))
    } else {
      await this.scrollToCategory(0)
    }
  },
  methods: {
    async fetchData () {
      this.loading = true
      await foodApi.getAll().then((res) => {
        this.food = res.data
      })
      await categoryApi.getAll().then((res) => {
        this.category = [{ id: 0, Category_Name: 'ทั้งหมด' }, ...res.data]
        this.loading = false
      })
    },
    goToSlug (id) {
      this.$router.push(`/food-truck/_food_slug/${id}`)
    },
    scrollToCategory (id) {
      if (id > 0) {
        this.$refs[`category-#${id}`][0].scrollIntoView({ behavior: 'smooth' })
        this.$router.replace(this.$router.currentRoute.path).catch(()=>{})
      } else {
        this.$vuetify.goTo(0)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .header-management {
    position: relative;
    top: -20px
  }
</style>

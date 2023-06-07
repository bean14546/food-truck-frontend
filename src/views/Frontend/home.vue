<template>
  <div>
    <section id="header" class="px-6 pt-6 pb-0">
      <h1 class="primary--text font-weight-regular mb-6">สวัสดี ผู้ใช้</h1>
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
              <v-list-item-title v-text="data.item.Food_Name" />
              <v-list-item-subtitle v-text="data.item.Food_Description" />
            </v-list-item-content>
            <v-list-item-action>
              <span class="green--text"> {{ data.item.Food_Price }} บาท </span>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-autocomplete>
    </section>

    <section id="recommend" class="pt-6 pb-0 pl-6">
      <sliderComponent
        :items="recommendFood"
      >
        <template #item="{ item }">
          <menuCardComponent class="mr-4" :food="item" :to="item.id" color="#F53B50" name-slug="food" recommend />
        </template>
      </sliderComponent>
    </section>

    <section id="category" class="pt-6 pb-0 pl-6">
      <sliderComponent
        :items="category"
      >
        <template #item="{ item }">
          <categoryCardComponent class="mr-4" :category="item" />
        </template>
      </sliderComponent>
    </section>

    <section id="new-arrival" class="secondary mt-6 mb-14">
      <div class="py-6 pl-6">
        <h3 class="font-weight-regular mb-0">
          หากคุณกำลังมองหา
          <span class="primary--text font-weight-bold">
            เมนูใหม่!
          </span>
        </h3>
        <p class="grey--text font-weight-regular"> เมนูมาใหม่ แสนอร่อยพร้อมให้คุณมาลิ้มลอง </p>
        <sliderComponent
          :items="newFood"
        >
          <template #item="{ item }">
            <menuCardComponent class="mr-4" :food="item" :to="item.id" name-slug="food" />
          </template>
        </sliderComponent>
      </div>
    </section>
  </div>
</template>

<script>
// Components
import menuCardComponent from '@/components/card/menuCard.vue'
import categoryCardComponent from '@/components/card/categoryCard.vue'
import sliderComponent from '@/components/slider.vue'
// API
import foodApi from '@/api/foodApi'
import categoryApi from '@/api/categoryApi'
// function
export default {
  name: 'HomePage',
  components: {
    menuCardComponent,
    categoryCardComponent,
    sliderComponent
  },
  layout: 'FrontendLayout',
  data () {
    return {
      food: [],
      category: []
    }
  },
  computed: {
    // กรองเอาแต่เมนูแนะนำจากเมนูทั้งหมด
    recommendFood () {
      return this.food.filter(item => item.is_recommend === 1)
    },
    // กรองเอาแต่เมนูใหม่จากเมนูทั้งหมด
    newFood () {
      return this.food.filter(item => item.is_new === 1)
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      foodApi.getAll().then((res) => {
        this.food = res.data
      })
      categoryApi.getAll().then((res) => {
        this.category = res.data
      })
    },
    goToSlug (id) {
      this.$router.push(`/food-truck/_food_slug/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  // ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

<template>
  <div>
    <progressLoaderComponent v-if="loading" fullScreen />
    <div v-else>
      <section id="header" v-if="food">
        <v-card elevation="0">
          <v-img :src="food.Food_Image" aspect-ratio="1.5" />
          <div class="px-2">
            <v-card-title class="d-flex justify-space-between primary--text font-weight-bold pb-2">
              <span> {{ food.Food_Name }} </span>
              <span> {{ food.Food_Price }} บาท </span>
            </v-card-title>
            <v-card-text>
              <p class="text-center darkGrey--text mb-0 px-4">
                {{ food.Food_Description }}
              </p>
            </v-card-text>
          </div>
        </v-card>
        <v-divider class="grey mx-4" />
      </section>

      <section id="switch">
        <v-switch v-model.number="isTakeaway" class="px-6 pt-0" :true-value="1" :false-value="0" hide-details>
          <template #label>
            <v-spacer />
            <p class="mb-0">ห่อกลับบ้าน</p>
          </template>
        </v-switch>
      </section>

      <section id="options" v-if="food.Option && food.Option.length > 0">
        <div v-for="(option, optionIndex) in food.Option" :key="`${optionIndex}-option`" :class="!(option.option_details.every(item => item.isActive === 0)) ? 'px-6 pt-4' : ''">
          <template v-if="!(option.option_details.every(item => item.isActive === 0))">
            <p class="primary--text font-weight-bold"> {{ option.Option_Name }} </p>
            <v-form ref="form">
              <v-radio-group hide-details :rules="optionRules" @change="selectOption">
                <v-radio
                  v-for="(option_detail, optionDetailIndex) in option.option_details.filter(item => item.isActive === 1)"
                  :key="`${optionDetailIndex}-option_details`"
                  :value="option_detail"
                  class="mb-4"
                >
                  <template #label>
                    <div class="d-flex justify-space-between w-100">
                      <span>{{ option_detail.Option_Detail_Name }}</span>
                      <span>{{ option_detail.Option_Detail_Price > 0 ? option_detail.Option_Detail_Price + ' บาท' : 'ฟรี' }}</span>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-form>
          </template>
        </div>
        <v-divider class="grey mx-4" />
      </section>

      <section id="topping" v-if="food.Topping && food.Topping.length > 0">
        <div class="px-6 pt-4">
          <p class="primary--text font-weight-bold"> เครื่องเคียง </p>
          <v-checkbox
            v-for="(topping, index) in food.Topping"
            :key="`${index}-toppings`"
            :value="topping"
            v-model="toppingSelected"
            class="mb-4"
            hide-details
          >
            <template #label>
              <div class="d-flex justify-space-between w-100">
                <span>{{ topping.Topping_Name }}</span>
                <span>{{ topping.Topping_Price > 0 ? topping.Topping_Price + ' บาท' : 'ฟรี' }}</span>
              </div>
            </template>
          </v-checkbox>
        </div>
        <v-divider class="grey mx-4" />
      </section>

      <section id="more-details">
        <div class="mb-16 px-6 pt-4">
          <p class="primary--text font-weight-bold"> รายละเอียดเพิ่มเติม </p>
          <v-text-field
            v-model="note"
            label="รายละเอียดเพิ่มเติม"
            placeholder="กรอกรายละเอียดเพิ่มเติมของคุณที่นี่"
            outlined
            hide-details
          />
        </div>
      </section>

      <section id="navigation">
        <v-bottom-navigation class="elevation-0 px-5" color="primary" fixed>
            <div class="d-flex justify-center align-center mr-3">
              <v-btn class="rounded-pill" color="primary" height="36px" width="36px" x-small :disabled="this.quantity <= 1" @click="reduce">
                <v-icon class="white--text">mdi-minus</v-icon>
              </v-btn>
              <p class="quantity black--text text-subtitle-1 font-weight-regular text-center mr-4 mb-0 ml-4"> {{ quantity }} </p>
              <v-btn class="rounded-pill" color="primary" height="36px" width="36px" x-small @click="increase">
                <v-icon class="white--text">mdi-plus</v-icon>
              </v-btn>
            </div>
            <div class="d-flex justify-center align-center w-100 ml-3">
              <v-btn
                class="rounded"
                min-height="36px"
                height="36px"
                max-height="36px"
                color="primary"
                block
                @click="order"
              >
                <span class="white--text text-subtitle-1 font-weight-regular"> รวม {{ total }} บาท </span>
              </v-btn>
            </div>
        </v-bottom-navigation>
      </section>
    </div>
  </div>
</template>

<script>
// API
import foodApi from '@/api/foodApi'
// Commponent
import progressLoaderComponent from '@/components/progressLoader'
export default {
  name: 'FoodSlugPage',
  components: {
    progressLoaderComponent
  },
  data () {
    return {
      loading: true,
      food: {
        id: 14,
        Food_Name: null,
        Food_Price: null,
        Food_Description: null,
        Food_Image: null,
        Food_Status: [],
        Category: [],
        Option: []
      },
      optionSelected: [],
      toppingSelected: [],
      note: '',
      isTakeaway: 0,
      quantity: 1,
      // Rules
      optionRules: [v => !!v]
    }
  },
  computed: {
    total () {
      const optionPrice = this.optionSelected.length > 0 ? this.optionSelected.map((res) => res.Option_Detail_Price).reduce((prev, curr) => prev + curr) : 0
      const toppingPrice = this.toppingSelected.length > 0 ? this.toppingSelected.map((res) => res.Topping_Price).reduce((prev, curr) => prev + curr) : 0
      const total = (optionPrice + toppingPrice + this.food.Food_Price) * this.quantity
      return total
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      foodApi.getOne(this.$route.params._slug).then((res) => {
        this.food = res.data
        this.loading = false
      })
    },
    reduce () {
      if (this.quantity > 1) {
        this.quantity -= 1
      }
    },
    increase () {
      this.quantity += 1
    },
    selectOption (option) {
      // เช็คว่าใน array optionSelected มี option_id ที่ตรงกับ option ที่เลือก" หรือไม่
      const condition = this.optionSelected.map(res => res.option_id).includes(option.option_id)
      if (condition) {
        // ถ้ามีให้ลบตัวนั้นออกแล้วแทนที่ด้วย option ที่เลือกล่าสุด
        this.optionSelected.splice(this.optionSelected.findIndex(item => item.option_id === option.option_id), 1, option)
      } else {
        // ถ้าไม่มีให้เพิ่ม option เข้า array optionSelected
        this.optionSelected.push(option)
      }
    },
    order () {
      const obj = {
        food: this.food,
        optionSelected: this.optionSelected,
        toppingSelected: this.toppingSelected,
        note: this.note,
        isTakeaway: this.isTakeaway,
        quantity: this.quantity,
        total: this.total
      }
      if (this.food.Option.length > 0) {
        const rules = this.$refs.form.map(item => item.validate())
        if (rules.every(element => element === true)) {
          this.$store.commit('addToCart', obj)
          this.$router.push('/food-truck/cart')
        }
      } else {
        this.$store.commit('addToCart', obj)
        this.$router.push('/food-truck/cart')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // .btn-plus, .btn-minus  {
  //   border-radius: 50% !important;
  // }
  .quantity {
    width: 20px;
  }
</style>

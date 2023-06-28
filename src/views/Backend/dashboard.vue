<template>
  <div>
    <v-row>
      <v-spacer />
      <v-col class="d-flex pb-0" cols="12" md="4">
        <dateDialog @dateFilter="dateFilter" />
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col v-for="(item, index) in array" :key="index" class="pb-0" :class="index + 1 === array.length ? 'pr-3' : (index === 0 || index === 2 ? 'pr-md-0' : 'pr-md-3 pr-lg-0')" cols="12" md="6" lg="3">
            <summarizeCard :item="item" :loading="loading" />
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col class="pb-0 pr-md-0" cols="12" md="4">
            <chartCard ref="chartDoughnutCard" :loading="loading" title="อาหารขายดี 3 อันดับแรก" :subtitle="`จากอาหารทั้งหมด ${allFoodQuantity} อย่าง`" />
          </v-col>
          <v-col class="pb-md-0" cols="12" md="8">
            <chartCard ref="chartBarCard" :loading="loading" title="วัตถุดิบที่ถูกนำเข้ามากที่สุด 5 อันดับแรก" :subtitle="`จากวัตถุดิบทั้งหมด ${allIngredientQuantity} ชนิด`" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// API
import foodApi from '@/api/foodApi'
import ingredientApi from '@/api/ingredientApi'
import orderListApi from '@/api/orderListApi'
import logDateStockApi from '@/api/logDateStockApi'
// Components
import dateDialog from '@/components/backend/modal/dashboard/dateModal'
import summarizeCard from '@/components/card/backend/dashboard/summarizeCard'
import chartCard from '@/components/card/backend/dashboard/chartCard'
// Mixins
import { mixins } from '@/plugins/mixins'
export default {
  name: 'DashboardPage',
  components: {
    dateDialog,
    summarizeCard,
    chartCard
  },
  mixins: [mixins],
  data () {
    return {
      loading: true,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      array: [1, 2, 3, 4],
      allFoodQuantity: 0,
      allIngredientQuantity: 0,
      dataDoughnutChart: {
        labels: [],
        datasets: [
          {
            label: 'อาหารขายดี 3 อันดับแรก',
            data: [],
            backgroundColor: [
              'rgb(255, 99, 132, 0.5)',
              'rgb(54, 162, 235, 0.5)',
              'rgb(255, 205, 86, 0.5)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            borderWidth: 1,
            hoverOffset: 4
          }
        ]
      },
      dataBarChart: {
        labels: [],
        datasets: [
          {
            label: 'วัตถุดิบที่ถูกนำเข้ามากที่สุด 5 อันดับแรก',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(255, 205, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(201, 203, 207, 0.5)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            hoverOffset: 4,
            grouped: false
          }
        ]
      },
      barChart: null,
      doughnutChart: null
    }
  },
  async mounted () {
    this.loading = true
    await this.fetchData()
    await this.renderDoughnutChart()
    await this.renderBarChart()
    this.loading = false
  },
  methods: {
    async fetchData () {
      const array = []
      let cost = 0
      let sales = 0

      await foodApi.getAll().then((res) => {
        // จำนวนอาหารที่มีทั้งหมด
        const allFoodQuantity = res.data.length
        this.allFoodQuantity = allFoodQuantity
      })

      await ingredientApi.getAll().then((res) => {
        // จำนวนวัตถุดิบทั้งหมด
        const allIngredientQuantity = res.data.length
        this.allIngredientQuantity = allIngredientQuantity
      })

      await orderListApi.getAll().then((res) => {
        // ยอดขายทั้งหมด
        const result = res.data.filter(item => (this.formatDate(item.created_at) === this.date) && (item.order_list_status_id === 4)).reduce((accumulator, item) => {
          const { Price } = item
          return accumulator + Price
        }, 0)
        const obj = { name: 'ยอดขาย', value: result, pronoun: 'บาท' }
        array.push(obj)
        sales = result

        // อาหารที่ถูกซื้อเยอะที่สุด 3 อันดับแรก
        const foodName = res.data.filter(item => this.formatDate(item.created_at) === this.date).map(item => item.Food.Food_Name)
        this.dataDoughnutChart.labels = this.ranking(foodName, 3).topDataDuplicates
        this.dataDoughnutChart.datasets[0].data = this.ranking(foodName, 3).topNumberDuplicates
      })

      await logDateStockApi.getAll().then((res) => {
        // ต้นทุนทั้งหมด
        const result = res.data.filter(item => this.formatDate(item.created_at) === this.date).reduce((accumulator, item) => {
          const { ingredient, log_quantity } = item
          return accumulator + (ingredient.cost * log_quantity)
        }, 0)
        const obj2 = { name: 'ต้นทุน', value: result, pronoun: 'บาท' }
        array.push(obj2)
        cost = result

        // วัตถดิบนำเข้า 5 อันดับแรก
        const ingredientName = res.data.filter(item => this.formatDate(item.created_at) === this.date).map(item => item.ingredient.ingredient)
        this.dataBarChart.labels = this.ranking(ingredientName, 5).topDataDuplicates
        this.dataBarChart.datasets[0].data = this.ranking(ingredientName, 5).topNumberDuplicates
      })

      // คำนวณกำไร ขาดทุน
      const profit = await sales - cost
      const objProfit = await { name: 'กำไร', value: profit > 0 ? profit : 0, pronoun: 'บาท' }
      const objLoss = await { name: 'ขาดทุน', value: profit > 0 ? 0 : profit, pronoun: 'บาท' }
      array.push(objProfit)
      array.push(objLoss)

      this.array = await array
    },
    ranking (name, topRankNumber) {
      const duplicates = name.reduce((countMap, num) => {
        countMap[num] = (countMap[num] || 0) + 1
        return countMap
      }, {})
      const sortedDuplicates = Object.entries(duplicates).sort((a, b) => b[1] - a[1])
      const topDataDuplicates = sortedDuplicates.filter((entry, index) => index < topRankNumber).map(entry => entry[0])
      const topNumberDuplicates = sortedDuplicates.filter((entry, index) => index < topRankNumber).map(entry => entry[1])
      return { topDataDuplicates, topNumberDuplicates }
    },
    renderDoughnutChart () {
      const doughnutChartObj = { dataChart: this.dataDoughnutChart, type: 'doughnut' }
      this.$refs.chartDoughnutCard.renderChart(doughnutChartObj)
    },
    renderBarChart () {
      const barChartObj = { dataChart: this.dataBarChart, type: 'bar' }
      this.$refs.chartBarCard.renderChart(barChartObj)
    },
    destroyAndRecreateDoughnutChart () {
      const doughnutChartObj = { dataChart: this.dataDoughnutChart, type: 'doughnut' }
      this.$refs.chartDoughnutCard.destroyAndRecreateChart(doughnutChartObj)
    },
    destroyAndRecreateBarChart () {
      const barChartObj = { dataChart: this.dataBarChart, type: 'bar' }
      this.$refs.chartBarCard.destroyAndRecreateChart(barChartObj)
    },
    async dateFilter (date) {
      this.loading = true
      this.date = date
      await this.fetchData()
      await this.destroyAndRecreateDoughnutChart()
      await this.destroyAndRecreateBarChart()
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
</style>

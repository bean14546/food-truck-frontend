<template>
  <div>
    <v-row>
      <v-spacer />
      <v-col class="d-flex pb-0" cols="12" md="4">
        <v-dialog v-model="modal" ref="dialog" width="290px" persistent :return-value.sync="date">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="date" class="filter-input" height="52" prepend-inner-icon="mdi-calendar" label="PICKER IN DIALOG" hide-details solo readonly v-bind="attrs" v-on="on" />
          </template>
          <v-date-picker v-model="date" scrollable>
            <v-spacer />
            <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="dateFilter(date)"> OK </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col v-for="(item, index) in array" :key="index" :class="index + 1 === array.length ? 'pr-3 pb-0' : 'pr-md-0 pb-0'" cols="12" md="6" lg="3">
            <v-card class="pa-6" elevation="15" rounded="lg">
              <v-card-text v-if="!loading" class="font-weight-medium text-h6 d-flex pa-2">
                <p class="mb-0"> {{ item.name }} </p>
                <v-spacer />
                <p class="mb-0">
                  <span class="mr-2">{{ item.value }}</span>
                  <span>{{ item.pronoun }}</span>
                </p>
              </v-card-text>
              <v-skeleton-loader
                v-else
                type="text"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col class="pr-md-0 pb-0" cols="12" md="4">
            <v-card class="pa-6" height="100%" elevation="15" rounded="xl">
              <v-card-title v-if="!loading" class="darkGrey--text justify-center pt-0"> อาหารขายดี 3 อันดับแรก </v-card-title>
              <v-skeleton-loader v-else type="list-item" />
              <v-card-subtitle v-if="!loading" class="text-center">จากอาหารทั้งหมด {{ allFoodQuantity }} อย่าง</v-card-subtitle>
              <canvas :class="loading ? 'd-none' : 'd-block'" ref="doughnutChart" />
              <v-skeleton-loader v-if="loading" type="card, article" />
            </v-card>
          </v-col>
          <v-col class="pb-0"  cols="12" md="8">
            <v-card class="pa-6" height="100%" elevation="15" rounded="xl">
              <v-card-title v-if="!loading" class="darkGrey--text justify-center pt-0"> วัตถุดิบที่ถูกนำเข้ามากที่สุด 5 อันดับแรก </v-card-title>
              <v-skeleton-loader v-else type="list-item" />
              <v-card-subtitle v-if="!loading" class="text-center">จากวัตถุดิบทั้งหมด {{ allIngredientQuantity }} ชนิด</v-card-subtitle>
              <canvas :class="loading ? 'd-none' : 'd-block'" ref="barChart" />
              <v-skeleton-loader v-if="loading" type="article, card" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import foodApi from '@/api/foodApi'
import ingredientApi from '@/api/ingredientApi'
import orderListApi from '@/api/orderListApi'
import logDateStockApi from '@/api/logDateStockApi'
import { mixins } from '@/plugins/mixins'
export default {
  name: 'DashboardPage',
  mixins: [mixins],
  data () {
    return {
      modal: false,
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
    await this.renderBarChart()
    await this.renderDoughnutChart()
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
        const duplicates = foodName.reduce((countMap, num) => {
          countMap[num] = (countMap[num] || 0) + 1
          return countMap
        }, {})
        const sortedDuplicates = Object.entries(duplicates).sort((a, b) => b[1] - a[1])
        const top3DataDuplicates = sortedDuplicates.filter((entry, index) => index < 3).map(entry => entry[0])
        const top3NumberDuplicates = sortedDuplicates.filter((entry, index) => index < 3).map(entry => entry[1])
        this.dataDoughnutChart.labels = top3DataDuplicates
        this.dataDoughnutChart.datasets[0].data = top3NumberDuplicates
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
        const duplicates = ingredientName.reduce((countMap, num) => {
          countMap[num] = (countMap[num] || 0) + 1
          return countMap
        }, {})
        const sortedDuplicates = Object.entries(duplicates).sort((a, b) => b[1] - a[1])
        const top3DataDuplicates = sortedDuplicates.filter((entry, index) => index < 5).map(entry => entry[0])
        const top3NumberDuplicates = sortedDuplicates.filter((entry, index) => index < 5).map(entry => entry[1])
        this.dataBarChart.labels = top3DataDuplicates
        this.dataBarChart.datasets[0].data = top3NumberDuplicates
      })

      // คำนวณกำไร ขาดทุน
      const profit = await sales - cost
      const objProfit = await { name: 'กำไร', value: profit > 0 ? profit : 0, pronoun: 'บาท' }
      const objLoss = await { name: 'ขาดทุน', value: profit > 0 ? 0 : profit, pronoun: 'บาท' }
      array.push(objProfit)
      array.push(objLoss)

      this.array = await array
    },
    renderBarChart () {
      const ctx = this.$refs.barChart ? this.$refs.barChart.getContext('2d') : false
      const dataBarChart = this.dataBarChart
      if (ctx) {
        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: dataBarChart,
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: {
              legend: {
                onClick: (event, legendItem, legend) => {
                  const index = legend.chart.data.labels.indexOf(legendItem.text)
                  legend.chart.toggleDataVisibility(index)
                  legend.chart.update()
                },
                labels: {
                  generateLabels: (chart) => {
                    let visibility = []
                    for (let i = 0; i < chart.data.labels.length; i++) {
                      if (chart.getDataVisibility(i) === true) {
                        visibility.push(false)
                      } else {
                        visibility.push(true)
                      }
                    }
                    return chart.data.labels.map((label, index) => ({
                      text: label,
                      fontColor: '#606060',
                      strokeStyle: chart.data.datasets[0].borderColor[index],
                      fillStyle: chart.data.datasets[0].backgroundColor[index],
                      hidden: visibility[index]
                    }))
                  }
                }
              }
            }
          }
        })
      }
    },
    renderDoughnutChart () {
      const ctx = this.$refs.doughnutChart ? this.$refs.doughnutChart.getContext('2d') : false
      const dataDoughnutChart = this.dataDoughnutChart
      if (ctx) {
        this.doughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: dataDoughnutChart,
          options: { scales: { y: { beginAtZero: true } } }
        })
      }
    },
    destroyAndRecreateBarChart () {
      if (this.barChart) {
        this.barChart.destroy()
      }
      this.renderBarChart()
    },
    destroyAndRecreateDoughnutChart () {
      if (this.doughnutChart) {
        this.doughnutChart.destroy()
      }
      this.renderDoughnutChart()
    },
    async dateFilter (date) {
      this.$refs.dialog.save(date),
      this.loading = true
      await this.fetchData()
      await this.destroyAndRecreateBarChart()
      await this.destroyAndRecreateDoughnutChart()
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
// ต้องมี comment เนื่องจากเชื่อมกับ scss
.filter-input {
  box-shadow: 0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12) !important;
}
</style>

<template>
  <v-card class="pa-6" height="100%" elevation="15" rounded="xl">
    <v-card-title v-if="!loading" class="d-block text-center darkGrey--text text-md-subtitle-1 font-weight-md-bold text-lg-h6 font-weight-lg-medium pt-0"> {{ title }} </v-card-title>
    <v-skeleton-loader v-else type="list-item" />
    <v-card-subtitle v-if="!loading" class="text-center text-md-subtitle-2"> {{ subtitle }} </v-card-subtitle>
    <canvas :class="loading ? 'd-none' : 'd-block'" ref="chart" />
    <v-skeleton-loader v-if="loading" type="card, article" />
  </v-card>
</template>

<script>
import Chart from 'chart.js/auto'
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  },
  data () { return { chart: null } },
  computed:{
    plugins () {
      return {
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
  },
  methods: {
    renderChart (dataChartObj) {
      if (dataChartObj) {
        const ctx = this.$refs.chart.getContext('2d')
        const typeChart = dataChartObj.type
        const dataChart = dataChartObj.dataChart
        this.chart = new Chart(ctx, {
          type: typeChart,
          data: dataChart,
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: typeChart === 'bar' ? (dataChart.labels.length > 0 ? this.plugins : { legend: { display: false } }) : [false]
          }
        })
        this.$forceUpdate()
      }
    },
    destroyAndRecreateChart (dataChartObj) {
      if (this.chart) this.chart.destroy()
      this.renderChart(dataChartObj)
    }
  }
}
</script>

<style lang="scss" scoped>
  //
</style>
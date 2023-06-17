import moment from 'moment'

export const mixins = {
  methods: {
    indexPage (currentPage, perPage, index) {
      const indexPage = ((currentPage * perPage) - perPage) + (index + 1)
      return indexPage
    },
    statusName (status) {
      const statusName = status ? 'ปิด' : 'เปิด'
      return statusName
    },
    formatDate (time) {
      const formatDate = moment(String(time)).format('DD/MM/YYYY')
      return formatDate
    },
    formatPrice (value) {
      const priceDecimal = (value/1).toFixed(2)
      // const formatPrice = priceDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // return formatPrice
      return priceDecimal
    },
    formatNumber (value) {
      const priceDecimal = (value/1)
      // const formatPrice = priceDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // return formatPrice
      return priceDecimal
    }
  }
}
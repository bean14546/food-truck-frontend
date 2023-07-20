import moment from 'moment'
import Swal from 'sweetalert2'

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
      const formatDate = moment(String(time)).format('YYYY-MM-DD')
      return formatDate
    },
    formatPrice (value) {
      const priceDecimal = Number(value).toFixed(2)
      const formatPrice = priceDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return formatPrice
    },
    formatNumber (value) {
      const numberDecimal = Number(value)
      const formatNumber = numberDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return formatNumber
    },
    async sweatAlert ({
      position = 'top-end',
      showConfirmButton = false,
      timer = 2000,
      timerProgressBar = true,
      icon = 'success',
      title = 'No Title'
    }) {
      const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: showConfirmButton,
        timer: timer,
        timerProgressBar: timerProgressBar,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      await Toast.fire({
        icon: icon,
        title: title
      })

      return await new Promise((resolve) => {
        return resolve()
      })
    }
  }
}
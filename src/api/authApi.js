import axios from '@/api/apiInstance'

export default {
  adminLogin: (data) => {
    return axios.post('auth/login', data).then(response => response.data)
  },
  adminLogout: (token) => {
    return axios.post('auth/logout', token).then(response => response.data)
  }
}

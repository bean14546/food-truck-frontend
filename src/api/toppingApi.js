import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('topping/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`topping/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('topping/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.get('topping/create', data).then(response => response.data)
  },
  update: (id) => {
    return axios.get(`topping/update/${id}`).then(response => response.data)
  },
  delete: (id) => {
    return axios.get(`topping/delete/${id}`).then(response => response.data)
  }
}

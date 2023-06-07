import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('topping/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`topping/getOne/${id}`).then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('topping/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('topping/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('topping/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`topping/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`topping/delete/${id}`).then(response => response.data)
  }
}

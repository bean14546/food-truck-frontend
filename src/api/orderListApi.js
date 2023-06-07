import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('orderList/getAll').then(response => response.data)
  },
  getAndCount: () => {
    return axios.get('orderList/getAndCount').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`orderList/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('orderList/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('orderList/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`orderList/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`orderList/delete/${id}`).then(response => response.data)
  }
}

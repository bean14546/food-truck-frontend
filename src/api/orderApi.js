import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('order/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`order/getOne/${id}`).then(response => response.data)
  },
  getAndCount: () => {
    return axios.get('order/getAndCount').then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('order/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('order/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`order/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`order/delete/${id}`).then(response => response.data)
  }
}

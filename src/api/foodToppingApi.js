import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('foodTopping/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`foodTopping/getOne/${id}`).then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('foodTopping/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('foodTopping/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('foodTopping/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`foodTopping/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`foodTopping/delete/${id}`).then(response => response.data)
  }
}

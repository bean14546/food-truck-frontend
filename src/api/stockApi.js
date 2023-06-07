import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('stock/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('stock/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`stock/getOne/${id}`).then(response => response.data)
  },
  search: (keyword, searchParams) => {
    return axios.get('stock/search', { params: { keyword: keyword, page: searchParams } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('stock/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`stock/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`stock/delete/${id}`).then(response => response.data)
  }
}

import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('logDateStock/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('logDateStock/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`logDateStock/getOne/${id}`).then(response => response.data)
  },
  search: (keyword, searchParams) => {
    return axios.get('logDateStock/search', { params: { keyword: keyword, page: searchParams } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('logDateStock/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`logDateStock/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`logDateStock/delete/${id}`).then(response => response.data)
  }
}

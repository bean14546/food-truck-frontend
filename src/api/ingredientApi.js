import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('ingredient/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('ingredient/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`ingredient/getOne/${id}`).then(response => response.data)
  },
  search: (keyword, searchParams) => {
    return axios.get('ingredient/search', { params: { keyword: keyword, page: searchParams } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('ingredient/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`ingredient/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`ingredient/delete/${id}`).then(response => response.data)
  }
}

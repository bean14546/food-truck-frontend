import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('foodOption/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`foodOption/getOne/${id}`).then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('foodOption/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('foodOption/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('foodOption/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`foodOption/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`foodOption/delete/${id}`).then(response => response.data)
  }
}

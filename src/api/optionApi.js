import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('option/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('option/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`option/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('option/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('option/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`option/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`option/delete/${id}`).then(response => response.data)
  }
}

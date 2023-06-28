import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('stockDate/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('stockDate/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`stockDate/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('stockDate/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('stockDate/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`stockDate/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`stockDate/delete/${id}`).then(response => response.data)
  }
}

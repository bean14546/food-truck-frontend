import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('orderListStatus/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`orderListStatus/getOne/${id}`).then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('orderListStatus/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('orderListStatus/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('orderListStatus/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`orderListStatus/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`orderListStatus/delete/${id}`).then(response => response.data)
  }
}

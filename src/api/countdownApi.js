import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('countdown/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`countdown/getOne/${id}`).then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('countdown/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('countdown/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('countdown/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`countdown/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`countdown/delete/${id}`).then(response => response.data)
  }
}

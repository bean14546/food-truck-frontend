import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('optionDetail/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('optionDetail/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`optionDetail/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('optionDetail/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('optionDetail/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`optionDetail/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`optionDetail/delete/${id}`).then(response => response.data)
  }
}

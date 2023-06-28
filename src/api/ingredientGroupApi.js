import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('ingredientGroup/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('ingredientGroup/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`ingredientGroup/getOne/${id}`).then(response => response.data)
  },
  search: (keyword, searchParams) => {
    return axios.get('ingredientGroup/search', { params: { keyword: keyword, page: searchParams } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('ingredientGroup/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`ingredientGroup/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`ingredientGroup/delete/${id}`).then(response => response.data)
  }
}

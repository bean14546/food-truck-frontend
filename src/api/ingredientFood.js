import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('ingredientFood/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('ingredientFood/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`ingredientFood/getOne/${id}`).then(response => response.data)
  },
  search: (keyword, searchParams) => {
    return axios.get('ingredientFood/search', { params: { keyword: keyword, page: searchParams } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('ingredientFood/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`ingredientFood/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`ingredientFood/delete/${id}`).then(response => response.data)
  }
}

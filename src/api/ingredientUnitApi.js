import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('ingredientUnit/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('ingredientUnit/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`ingredientUnit/getOne/${id}`).then(response => response.data)
  },
  search: (keyword, searchParams) => {
    return axios.get('ingredientUnit/search', { params: { keyword: keyword, page: searchParams } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('ingredientUnit/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`ingredientUnit/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`ingredientUnit/delete/${id}`).then(response => response.data)
  }
}

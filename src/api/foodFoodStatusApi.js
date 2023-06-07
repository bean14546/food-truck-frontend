import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('foodFoodStatus/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`foodFoodStatus/getOne/${id}`).then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('foodFoodStatus/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('foodFoodStatus/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('foodFoodStatus/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`foodFoodStatus/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`foodFoodStatus/delete/${id}`).then(response => response.data)
  }
}

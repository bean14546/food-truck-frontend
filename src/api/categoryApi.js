import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('category/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`category/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('category/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.get('category/create', data).then(response => response.data)
  },
  update: (id) => {
    return axios.get(`category/update/${id}`).then(response => response.data)
  },
  delete: (id) => {
    return axios.get(`category/delete/${id}`).then(response => response.data)
  }
}

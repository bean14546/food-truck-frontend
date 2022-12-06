import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('food/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`food/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('food/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.get('food/create', data).then(response => response.data)
  },
  update: (id) => {
    return axios.get(`food/update/${id}`).then(response => response.data)
  },
  delete: (id) => {
    return axios.get(`food/delete/${id}`).then(response => response.data)
  }
}

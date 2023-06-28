import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('user/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`user/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('user/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('user/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`user/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`user/delete/${id}`).then(response => response.data)
  }
}

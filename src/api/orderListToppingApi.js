import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('orderListTopping/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`orderListTopping/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('orderListTopping/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('orderListTopping/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`orderListTopping/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`orderListTopping/delete/${id}`).then(response => response.data)
  }
}

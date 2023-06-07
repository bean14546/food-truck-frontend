import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('orderListOption/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`orderListOption/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('orderListOption/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('orderListOption/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`orderListOption/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`orderListOption/delete/${id}`).then(response => response.data)
  }
}

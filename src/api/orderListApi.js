import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('orderList/getAll').then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('orderList/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  getAndCountOrderListID1: (searchParams) => {
    return axios.get('orderList/getAndCountOrderListID1', { params: { page: searchParams } }).then(response => response.data)
  },
  getAndCountOrderListID2: (searchParams) => {
    return axios.get('orderList/getAndCountOrderListID2', { params: { page: searchParams } }).then(response => response.data)
  },
  getAndCountOrderListID3: (searchParams) => {
    return axios.get('orderList/getAndCountOrderListID3', { params: { page: searchParams } }).then(response => response.data)
  },
  getAndCountOrderListID4: (searchParams) => {
    return axios.get('orderList/getAndCountOrderListID4', { params: { page: searchParams } }).then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`orderList/getOne/${id}`).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('orderList/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('orderList/create', data).then(response => response.data)
  },
  update: (id, data) => {
    return axios.put(`orderList/update/${id}`, data).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`orderList/delete/${id}`).then(response => response.data)
  }
}

import axios from '@/api/apiInstance'

export default {
  getAll: () => {
    return axios.get('category/getAll').then(response => response.data)
  },
  getOne: (id) => {
    return axios.get(`category/getOne/${id}`).then(response => response.data)
  },
  getAndCount: (searchParams) => {
    return axios.get('category/getAndCount', { params: { page: searchParams } }).then(response => response.data)
  },
  search: (keyword) => {
    return axios.get('category/search', { params: { keyword: keyword } }).then(response => response.data)
  },
  create: (data) => {
    return axios.post('category/create', data, { headers: { 'Content-type': 'multipart/form-data' } }).then(response => response.data)
  },
  // ใช้ method post เนื่องจาก axios method put ไม่รองรับการส่ง Content-type แบบ multipart/form-data
  update: (id, data) => {
    return axios.post(`category/update/${id}`, data, { headers: { 'Content-type': 'multipart/form-data' } }).then(response => response.data)
  },
  delete: (id) => {
    return axios.delete(`category/delete/${id}`).then(response => response.data)
  }
}

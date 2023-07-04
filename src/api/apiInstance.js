import axios from 'axios'

const Instance = axios.create({
  baseURL: process.env.VUE_APP_URL_API,
  // baseURL: 'https://food-truck.azurewebsites.net/api/',
  withCredentials: true,
  // headers คือ ข้อมูลเพิ่มเติมที่เราต้องการส่งไปพร้อมกับ Request Header
  headers: {
    'Content-type': 'application/json', // Content-type เป็นการกำหนดชนิดของข้อมูลที่จะส่งไปให้ server
    'Accept': 'application/json' // accept คือ การระบุรูปแบบของข้อมูล
  }
})

// ติดปัญหา

Instance.interceptors.request.use((config) => {
  let token = null

  try {
    const adminStorageEnCoded = localStorage.getItem('admin')
    const adminStorageDecoded = adminStorageEnCoded ? atob(adminStorageEnCoded) : false
    const adminStorageJSON = adminStorageDecoded ? JSON.parse(adminStorageDecoded) : false
    token = adminStorageJSON ? adminStorageJSON.token : false
  } catch (error) {
    console.log('error from file apiInstance.JS', error)
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default Instance

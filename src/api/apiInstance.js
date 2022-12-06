import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://food-truck-project.local/api/',
  withCredentials: true,
  headers: {
    'Content-type': 'application/json', // Content-type เป็นการกำหนดชนิดของข้อมูลที่จะส่งไปให้ server
    'Accept': 'application/json' // accept คือ การระบุรูปแบบของข้อมูล
  }
})

export default instance
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB9uUjKU6rbqVjUPhUKkiDsIWWfo0u7gI4',
  authDomain: 'food-truck-9aa58.firebaseapp.com',
  projectId: 'food-truck-9aa58',
  storageBucket: 'food-truck-9aa58.appspot.com',
  messagingSenderId: '641161899721',
  appId: '1:641161899721:web:b8d0b4596e44e0f5876718',
  measurementId: 'G-W91CZ9WKWS'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }

import axios from 'axios'

const instance = axios.create({
  timeout: 6000,
})
instance.interceptors.request.use((config) => {
  if (localStorage.getItem('token')) {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
  }
  return config
})
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location = '/mountaineering-training-center/login'
      localStorage.removeItem('token')
    }
    if (error && error.response?.status == 500) {
      return Promise.reject(error)
    }
  },
)

export default instance

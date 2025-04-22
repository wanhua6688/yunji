import axios from 'axios'

const ins = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + '/api/v1',
  timeout: 10000,
})
ins.interceptors.request.use((config) => {
  return config
})

ins.interceptors.response.use((res) => {
  return res.data
})

export function getMobileLIst() {
  return ins.post('/cloud-mobile/mobile-page')
}

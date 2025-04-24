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

export function getMobileLIst(data = {}) {
  return ins.post('/cloud-mobile/mobile-page', {
    state: true,
    ...data,
  })
}

export function shutdownMobile(id) {
  return ins.post('/cloud-mobile/shutdown-mobile', {
    check: true,
    mobileIds: [id],
  })
}

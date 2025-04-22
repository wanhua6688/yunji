import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getMobileLIst } from '@/api'
export const useDeviceStore = defineStore(
  'device',
  () => {
    const deviceList = ref([])
    const currentDevice = ref(null)
    const isLoading = ref(true)
    function fetchDeviceList() {
      return getMobileLIst().then((res) => {
        console.log(res.data)
        const newApps = res.data.list.map((item) => {
          return {
            name: item.name,
            mobileId: item.mobileId,
            canuse: item.remoteUrl != undefined,
            url: item.remoteUrl ? item.remoteUrl : '',
          }
        })
        // console.log(newApps)
        deviceList.value = newApps
      })
    }

    /**
     * 根据mobileId查找设备的索引和URL
     * @param {string|number} mobileId - 要查找的设备ID
     * @returns {{index: number, url: string, device: object|null}} 返回设备索引、URL和设备对象，若未找到则index为-1
     */
    function findDeviceByMobileId(mobileId) {
      // 将传入的mobileId转换为数字进行比较
      const mobileIdNum = Number(mobileId)

      // 检查转换是否有效
      if (isNaN(mobileIdNum)) {
        // console.warn('提供的mobileId无法转换为数字:', mobileId)
        return { index: -1, url: '', device: null }
      }

      const index = deviceList.value.findIndex((device) => device.mobileId === mobileIdNum)
      // console.log('查找mobileId:', mobileIdNum, '找到设备索引:', index)

      if (index === -1) {
        return { index: -1, url: '', device: null }
      }
      const device = deviceList.value[index]
      // console.log(device, 'findDeviceByMobileId')
      currentDevice.value = device
      return {
        index,
        url: device.url,
        device,
      }
    }

    return {
      deviceList,
      currentDevice,
      isLoading,
      fetchDeviceList,
      findDeviceByMobileId,
    }
  },
  {
    persist: true,
  },
)

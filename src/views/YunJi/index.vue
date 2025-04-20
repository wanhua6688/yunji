<template>
  <div class="device-detail">
    <div class="header">
      <div class="back" @click="goBack">
        <van-icon name="arrow-left" />
        返回
      </div>
      <div class="title">
        {{ deviceName }}
      </div>
      <div class="placeholder"></div>
    </div>

    <div class="content-container">
      <div class="device" v-if="currentDevice">
        <div class="loading-container" v-if="isLoading">
          <van-loading type="spinner" color="#1989fa" size="48px" />
          <p class="loading-text">正在加载云手机...</p>
        </div>
        <iframe
          :src="currentDevice.url"
          frameborder="0"
          allowfullscreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allow="fullscreen; microphone; camera; midi; encrypted-media"
          referrerpolicy="origin"
          @load="handleIframeLoaded"
          :class="{ 'iframe-loaded': !isLoading }"
        ></iframe>
      </div>
      <div class="error-message" v-else>
        <p>未找到设备</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, Icon as VanIcon, Loading as VanLoading } from 'vant'

// 接收路由参数
const props = defineProps({
  uuid: String,
})

const route = useRoute()
const router = useRouter()

// 获取查询参数
const deviceName = ref(route.query.deviceName || '未知设备')
const uuid = ref(props.uuid || route.params.uuid || '无UUID')
const canuse = ref(true)
const isLoading = ref(true)
const deviceList = ref([
  {
    uid: 'e5f6g7h8',
    url: `https://main-hubstudio-api.hubstudio.vip/cloud-mobile/v2/cloud-mobile/opera/remote-qrcode?qrcodeToken=d1bc9063c92f4fe1b3b62ba39d081307`,
  },
  {
    uid: 'a1b2c3d4',
    url: `https://main-hubstudio-api.hubstudio.vip/cloud-mobile/v2/cloud-mobile/opera/remote-qrcode?qrcodeToken=1ac1a2dab60a459a967809069096f1bc`,
  },
])

// 返回函数
const goBack = () => {
  router.push({ name: 'Home' })
}

// 根据UUID查找设备信息
const currentDevice = computed(() => {
  return deviceList.value.find((device) => device.uid === uuid.value) || null
})

// 处理iframe加载问题
const handleIframeLoaded = () => {
  console.log('云手机已加载')
  // 设置短暂停确保内容完全加载
  setTimeout(() => {
    isLoading.value = false
    showToast({
      message: '设备加载完成',
      position: 'bottom',
    })
  }, 1000)
  // 触发resize事件以确保内容适配
  window.dispatchEvent(new Event('resize'))
}

// 窗口大小调整处理函数
const handleResize = () => {
  if (currentDevice.value) {
    console.log('窗口尺寸变化，重新调整iframe')
    // 在这里可以添加额外的调整逻辑
  }
}

onMounted(() => {
  if (currentDevice.value) {
    // showToast({
    //   message: `已加载设备: ${deviceName.value}`,
    //   position: 'top',
    // })

    // 为了确保跨域引用安全，将URL打开到一个新窗口的选项
    console.log('加载云手机URL:', currentDevice.value.url)
  } else {
    showToast({
      message: `找不到设备: ${uuid.value}`,
      position: 'top',
      type: 'fail',
    })
  }

  console.log('设备参数:', {
    uuid: uuid.value,
    deviceName: deviceName.value,
    deviceFound: !!currentDevice.value,
  })

  // 添加事件监听器，确保窗口尺寸变化时iframe会重新调整
  window.addEventListener('resize', handleResize)

  // 初始触发一次以确保正确布局
  setTimeout(handleResize, 500)
})

onUnmounted(() => {
  // 移除事件监听器
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.device-detail {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 100;
  position: relative;
  height: 36px;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}

.back {
  display: flex;
  align-items: center;
  color: #2c3e50;
  cursor: pointer;
  font-size: 14px;
  flex: 0 0 auto;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 10px;
}

.placeholder {
  width: 40px;
  flex: 0 0 auto;
}

.back .van-icon {
  margin-right: 4px;
}

.content-container {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 36px);
}

.device {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #000;
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
}

.loading-text {
  color: white;
  margin-top: 12px;
  font-size: 14px;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
  display: block;
  background-color: #000;
  opacity: 0; /* 初始不可见 */
  transition: opacity 0.3s;
}

.iframe-loaded {
  opacity: 1;
}

.error-message {
  padding: 20px;
  text-align: center;
  color: #ff4d4f;
  font-size: 16px;
}

.device-info p {
  margin: 8px 0;
  font-size: 15px;
  color: #646566;
}
</style>

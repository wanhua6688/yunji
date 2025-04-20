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
    url: `https://main-manager.hubstudio.vip/1.35/mobile-remote.html?currentToken=%7B%22resultInfo%22:%7B%22controlList%22:%5B%7B%22controlCode%22:%22CS-TCP-CONTROL-27%22,%22controlInfoList%22:%5B%7B%22controlIp%22:%2210.6.234.8%22,%22controlPort%22:10270,%22traceServer%22:%22%22%7D%5D%7D%5D,%22webControlList%22:%5B%7B%22webControlCode%22:%22CS-TCP-CONTROL-27%22,%22webControlInfoList%22:%5B%7B%22controlIp%22:%22paascsc.armvm.com%22,%22controlPort%22:10277,%22traceServer%22:%22%22,%22ctLine%22:%22paascsc-ct.armvm.com%22,%22cuLine%22:%22paascsc-cu.armvm.com%22,%22cmccLine%22:%22paascsc-cm.armvm.com%22%7D%5D%7D%5D,%22webRtcControlList%22:%5B%7B%22webRtcControlInfoList%22:%5B%7B%22controlIp%22:%2210.6.234.8%22,%22controlPort%22:10270,%22traceServer%22:%22%22%7D%5D,%22controlCode%22:%22CS-TCP-CONTROL-27%22,%22gateway%22:%7B%22gatewayIp%22:%22paascsc.armvm.com%22,%22ctLine%22:%22paascsc-ct.armvm.com%22,%22cuLine%22:%22paascsc-cu.armvm.com%22,%22cmccLine%22:%22paascsc-cm.armvm.com%22,%22gatewayPort%22:10063%7D%7D%5D,%22remoteList%22:%5B%5D,%22userId%22:5429710,%22sessionId%22:%227f582f2507da41249538806ca6898737%22,%22padList%22:%5B%7B%22controlCode%22:%22%22,%22padCode%22:%22VM010054014097%22,%22padStatus%22:%221%22,%22padType%22:%22ANDROID%22,%22videoCode%22:%22%22%7D%5D,%22tcpSslList%22:%5B%5D,%22wssList%22:%5B%5D,%22videoList%22:%5B%5D,%22merchantInfo%22:%7B%22appSecret%22:%22af17ea8d34df2a493c67a05d03b13578%22,%22appkey%22:%22bfd2b7583f9943f398bbc3845a052480%22%7D,%22domain%22:%22https://paas.armvm.com%22,%22controlTactics%22:%22auto%22,%22webRtcMode%22:%22%22,%22gateway%22:%7B%22gatewayIp%22:%22paascsc.armvm.com%22,%22gatewayPort%22:10063%7D%7D,%22padCode%22:%22VM010054014097%22%7D`,
  },
  {
    uid: 'a1b2c3d4',
    url: `https://main-manager.hubstudio.vip/1.35/mobile-remote.html?currentToken=%7B%22resultInfo%22:%7B%22controlList%22:%5B%7B%22controlCode%22:%22CS-TCP-CONTROL-28%22,%22controlInfoList%22:%5B%7B%22controlIp%22:%2210.6.234.8%22,%22controlPort%22:10280,%22traceServer%22:%22%22%7D%5D%7D%5D,%22webControlList%22:%5B%7B%22webControlCode%22:%22CS-TCP-CONTROL-28%22,%22webControlInfoList%22:%5B%7B%22controlIp%22:%22paascsc.armvm.com%22,%22controlPort%22:10287,%22traceServer%22:%22%22,%22ctLine%22:%22paascsc-ct.armvm.com%22,%22cuLine%22:%22paascsc-cu.armvm.com%22,%22cmccLine%22:%22paascsc-cm.armvm.com%22%7D%5D%7D%5D,%22webRtcControlList%22:%5B%7B%22webRtcControlInfoList%22:%5B%7B%22controlIp%22:%2210.6.234.8%22,%22controlPort%22:10280,%22traceServer%22:%22%22%7D%5D,%22controlCode%22:%22CS-TCP-CONTROL-28%22,%22gateway%22:%7B%22gatewayIp%22:%22paascsc.armvm.com%22,%22ctLine%22:%22paascsc-ct.armvm.com%22,%22cuLine%22:%22paascsc-cu.armvm.com%22,%22cmccLine%22:%22paascsc-cm.armvm.com%22,%22gatewayPort%22:10013%7D%7D%5D,%22remoteList%22:%5B%5D,%22userId%22:5429710,%22sessionId%22:%22bd0a1394a96e47919a67197cc9e28e3d%22,%22padList%22:%5B%7B%22controlCode%22:%22%22,%22padCode%22:%22VM010054014048%22,%22padStatus%22:%221%22,%22padType%22:%22ANDROID%22,%22videoCode%22:%22%22%7D%5D,%22tcpSslList%22:%5B%5D,%22wssList%22:%5B%5D,%22videoList%22:%5B%5D,%22merchantInfo%22:%7B%22appSecret%22:%22af17ea8d34df2a493c67a05d03b13578%22,%22appkey%22:%22bfd2b7583f9943f398bbc3845a052480%22%7D,%22domain%22:%22https://paas.armvm.com%22,%22controlTactics%22:%22auto%22,%22webRtcMode%22:%22%22,%22gateway%22:%7B%22gatewayIp%22:%22paascsc.armvm.com%22,%22gatewayPort%22:10013%7D%7D,%22padCode%22:%22VM010054014048%22%7D`,
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

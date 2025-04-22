<template>
  <div class="device-detail" :class="{ 'fullscreen-mode': isFullscreen }">
    <!-- 悬浮球 -->
    <div
      class="floating-ball"
      :style="{ left: ballPosition.x + 'px', top: ballPosition.y + 'px' }"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <!-- 主悬浮球 -->
      <div class="main-ball" @click="toggleMenu">
        <van-icon name="chat-o" size="26" />
      </div>

      <!-- 返回按钮 -->
      <div
        class="menu-ball blue-ball"
        :class="{ 'show-ball': menuVisible }"
        @click="goBack"
        title="返回"
      >
        <van-icon name="arrow-left" size="20" />
      </div>

      <!-- 全屏按钮 -->
      <div
        class="menu-ball green-ball"
        :class="{ 'show-ball': menuVisible }"
        @click="toggleFullscreen"
        title="全屏"
      >
        <van-icon :name="isFullscreen ? 'shrink' : 'expand'" size="20" />
      </div>

      <!-- 退出按钮 -->
      <div
        class="menu-ball red-ball"
        :class="{ 'show-ball': menuVisible }"
        @click="exitDevice"
        title="退出"
      >
        <van-icon name="cross" size="20" />
      </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, Icon as VanIcon, Loading as VanLoading } from 'vant'

const route = useRoute()
const router = useRouter()

// 获取查询参数
const deviceName = ref(route.query.deviceName || '未知设备')
const mobileId = ref(route.params.mobileId || '')

const canuse = ref(true)
const isLoading = ref(true)
import { useDeviceStore } from '@/stores/device'
const deviceStore = useDeviceStore()
// const deviceList = computed(() => deviceStore.devices)
// 悬浮球位置
const ballPosition = ref({
  x: window.innerWidth - 70,
  y: window.innerHeight - 100,
})

const currentDevice = ref(null)
const menuVisible = ref(false)
let isDragging = false
let dragOffset = { x: 0, y: 0 }

// 开始拖动
const startDrag = (event) => {
  // 如果菜单打开，点击就不触发拖动
  if (menuVisible.value) {
    menuVisible.value = false
    return
  }

  isDragging = true
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  dragOffset = {
    x: clientX - ballPosition.value.x,
    y: clientY - ballPosition.value.y,
  }

  // 添加移动和停止事件监听
  if (event.type === 'mousedown') {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  } else {
    document.addEventListener('touchmove', onDrag, { passive: false })
    document.addEventListener('touchend', stopDrag)
  }
}

// 拖动中
const onDrag = (event) => {
  if (!isDragging) return

  // 阻止默认行为，防止触摸设备上的滚动
  if (event.cancelable) event.preventDefault()

  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  // 计算新位置，并确保不会超出屏幕边界
  const newX = Math.max(0, Math.min(window.innerWidth - 60, clientX - dragOffset.x))
  const newY = Math.max(0, Math.min(window.innerHeight - 60, clientY - dragOffset.y))

  ballPosition.value = { x: newX, y: newY }

  // 如果拖动过程中菜单是开着的，关闭它
  if (menuVisible.value) {
    menuVisible.value = false
  }
}

// 停止拖动
const stopDrag = () => {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 切换菜单显示 - 简化为点击展开，再次点击收起
const toggleMenu = (event) => {
  // 防止事件传播
  if (event) event.stopPropagation()

  // 切换菜单状态
  menuVisible.value = !menuVisible.value

  // 打印状态，帮助调试
  console.log('菜单状态切换为：', menuVisible.value ? '显示' : '隐藏')
}

// 返回函数
const goBack = (event) => {
  // 防止事件传播
  if (event) event.stopPropagation()

  // 关闭菜单
  menuVisible.value = false
  router.push({ name: 'Home' })
}

// 全屏状态
const isFullscreen = ref(false)

// 切换全屏
const toggleFullscreen = (event) => {
  // 防止事件传播
  if (event) event.stopPropagation()

  // 关闭菜单
  menuVisible.value = false

  const contentContainer = document.querySelector('.content-container')
  const deviceIframe = document.querySelector('iframe')

  if (!isFullscreen.value) {
    // 进入全屏模式
    contentContainer.classList.add('vertical-fullscreen')
    
    // 使用全屏API
    if (deviceIframe) {
      // 优先对iframe元素进行全屏，获得更好的移动端体验
      if (deviceIframe.requestFullscreen) {
        deviceIframe.requestFullscreen().catch(err => {
          console.warn('无法对iframe元素进行全屏:', err)
          // 回退到对整个文档进行全屏
          fallbackToDocumentFullscreen()
        })
      } else if (deviceIframe.webkitRequestFullscreen) {
        deviceIframe.webkitRequestFullscreen().catch(err => {
          console.warn('无法对iframe元素进行全屏:', err)
          fallbackToDocumentFullscreen()
        })
      } else if (deviceIframe.mozRequestFullScreen) {
        deviceIframe.mozRequestFullScreen().catch(err => {
          console.warn('无法对iframe元素进行全屏:', err)
          fallbackToDocumentFullscreen()
        })
      } else if (deviceIframe.msRequestFullscreen) {
        deviceIframe.msRequestFullscreen().catch(err => {
          console.warn('无法对iframe元素进行全屏:', err)
          fallbackToDocumentFullscreen()
        })
      } else {
        // 如果iframe不支持全屏API，则回退到整个文档
        fallbackToDocumentFullscreen()
      }
    } else {
      fallbackToDocumentFullscreen()
    }
    
    // 隐藏地址栏（移动端）
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 100)
    
    isFullscreen.value = true
  } else {
    // 退出全屏模式
    contentContainer.classList.remove('vertical-fullscreen')
    
    // 退出全屏API
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    
    isFullscreen.value = false
  }
}

// 对整个文档进行全屏的回退方法
const fallbackToDocumentFullscreen = () => {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}

// 处理全屏状态变化
const handleFullscreenChange = () => {
  // 检测浏览器全屏状态
  const fullscreenActive =
    !!document.fullscreenElement ||
    !!document.webkitFullscreenElement ||
    !!document.mozFullScreenElement ||
    !!document.msFullscreenElement

  // 如果浏览器退出全屏但我们的状态仍为全屏，则同步状态
  if (!fullscreenActive && isFullscreen.value) {
    const contentContainer = document.querySelector('.content-container')
    contentContainer.classList.remove('vertical-fullscreen')
    isFullscreen.value = false
  }
}

// 监听全屏状态变化
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
})

// 退出当前云机
const exitDevice = (event) => {
  // 防止事件传播
  if (event) event.stopPropagation()

  // 关闭菜单
  menuVisible.value = false
  showToast({
    message: '已退出云手机',
    position: 'bottom',
  })
  router.push({ name: 'Home' })
}

// 根据mobileId查找设备信息 - 使用store数据

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

onMounted(async () => {
  console.log('设备ID:', mobileId.value)
  if (!mobileId.value) {
    showToast({
      message: '设备ID不能为空',
      position: 'top',
      type: 'fail',
    })
    setTimeout(() => {
      router.push({ name: 'Home' })
    }, 500)
    return
  }

  try {
    console.log('设备ID:', mobileId.value)
    console.log('设备列表数据:', deviceStore.deviceList)

    // 从 store 中获取设备信息
    const device = deviceStore.findDeviceByMobileId(mobileId.value)
    currentDevice.value = device
    console.log('设备查找结果:', device)
    if (!device) {
      showToast({
        message: `找不到设备: ${mobileId.value}`,
        position: 'top',
        type: 'fail',
      })
      setTimeout(() => {
        router.push({ name: 'Home' })
      }, 1500)
      return
    }
    // // 保存设备信息供显示使用
    // currentDeviceInfo.value = device
    // console.log('加载云手机URL:', url)
  } catch (error) {
    console.error('获取设备信息失败:', error)
    showToast({
      message: '获取设备信息失败',
      position: 'top',
      type: 'fail',
    })
  }

  // 打印最终的设备参数
  setTimeout(() => {
    console.log('最终设备参数:', {
      mobileId: mobileId.value,
      deviceName: deviceName.value,
      deviceFound: !!currentDevice.value,
      device: currentDevice.value,
    })
  }, 500)

  // 添加事件监听器，确保窗口尺寸变化时iframe会重新调整
  window.addEventListener('resize', handleResize)

  // 初始触发一次以确保正确布局
  setTimeout(handleResize, 500)
})

onUnmounted(() => {
  // 移除所有事件监听器
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

/* 悬浮球样式 */
.floating-ball {
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #1989fa; /* Vant 主题蓝色 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none;
  touch-action: none;
  font-size: 20px;
  transition:
    transform 0.2s,
    background-color 0.2s;
  z-index: 10;
  position: relative;
  overflow: hidden;
}

/* 图标样式 */
.main-ball .van-icon {
  color: white;
  font-weight: bold;
}

.main-ball:active {
  transform: scale(0.95);
  background-color: rgba(25, 137, 250, 0.9);
}

/* 菜单圆球共同样式 */
.menu-ball {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none;
  opacity: 0;
  visibility: hidden;
  z-index: 5;
  transition: all 0.3s ease;
}

/* 蓝色返回按钮 */
.blue-ball {
  background-color: #1989fa;
  transform: translate(-50px, -5px);
}

/* 绿色全屏按钮 */
.green-ball {
  background-color: #07c160;
  transform: translate(-35px, -45px);
}

/* 红色退出按钮 */
.red-ball {
  background-color: #ee0a24;
  transform: translate(0, -55px);
}

/* 显示菜单圆球 */
.show-ball {
  opacity: 1;
  visibility: visible;
  animation: popIn 0.3s ease forwards;
}

/* 弹出动画 */
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.5) translate(0, 0);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) translate(-50px, -5px);
  }
  100% {
    transform: scale(1) translate(-50px, -5px);
  }
}

/* 绿色按钮的弹出动画单独定义 */
.show-ball.green-ball {
  animation: popInGreen 0.3s ease forwards;
}

@keyframes popInGreen {
  0% {
    opacity: 0;
    transform: scale(0.5) translate(0, 0);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) translate(-35px, -45px);
  }
  100% {
    transform: scale(1) translate(-35px, -45px);
  }
}

/* 红色的弹出动画单独定义 */
.show-ball.red-ball {
  animation: popInRed 0.3s ease forwards;
}

@keyframes popInRed {
  0% {
    opacity: 0;
    transform: scale(0.5) translate(0, 0);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) translate(0, -55px);
  }
  100% {
    transform: scale(1) translate(0, -55px);
  }
}

.menu-item span {
  font-size: 14px;
}

.content-container {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
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

/* 全屏模式样式 */
.fullscreen-mode {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 添加竖向全屏样式 */
.vertical-fullscreen {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  padding: 0;
  margin: 0;
}

.vertical-fullscreen .device {
  width: auto;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.vertical-fullscreen iframe {
  width: auto;
  height: 100%;
  max-height: 100vh;
  aspect-ratio: 9/16; /* 移动设备竖向标准比例 */
  border: none;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

/* 全屏模式下调整悬浮球位置和样式 */
.fullscreen-mode .floating-ball {
  z-index: 10000; /* 确保悬浮球在全屏内容之上 */
}

/* 在全屏模式下减少悬浮球透明度，除非悬浮 */
.fullscreen-mode .main-ball {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.fullscreen-mode .main-ball:hover {
  opacity: 1;
}
</style>

<template>
  <div class="mobile-desktop">
    <!-- 应用图标区域 -->
    <div class="app-content">
      <!-- 加载中动画 -->
      <div v-if="deviceStore.isLoading" class="loading-container">
        <van-loading type="spinner" color="#1989fa" size="48px" />
        <p class="loading-text">正在加载设备列表...</p>
      </div>

      <!-- 空状态提示 -->
      <div v-else-if="deviceStore.deviceList.length === 0" class="empty-container">
        <van-empty description="暂无可用设备" />
      </div>

      <!-- 应用图标网格 -->
      <div v-else class="app-grid">
        <div
          v-for="(app, index) in deviceStore.deviceList"
          :key="index"
          class="app-icon-wrapper"
          :class="{ disabled: !app.canuse }"
          @click="handleAppClick(app, index)"
        >
          <div class="app-icon">
            <img src="@/assets/logo.png" alt="logo" class="app-logo" />
          </div>
          <div class="app-name">{{ app.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, Loading as VanLoading, Empty as VanEmpty } from 'vant'
import { onMounted } from 'vue'
import { useDeviceStore } from '@/stores/device'
const router = useRouter()
const deviceStore = useDeviceStore()

onMounted(async () => {
  try {
    deviceStore.isLoading = true
    await deviceStore.fetchDeviceList()
  } catch (error) {
    console.error('获取设备列表失败:', error)
    showToast({
      message: '获取设备列表失败',
      position: 'top',
      type: 'fail',
    })
  } finally {
    deviceStore.isLoading = false
  }
})
const handleAppClick = (app, index) => {
  if (app.canuse) {
    // 使用app的uid进行跳转
    router.push({
      name: 'Phone',
      params: { mobileId: app.mobileId },
      query: { deviceName: app.name },
    })
    // console.log(`跳转到: ${app.name}, mobileId: ${app.mobileId}, 索引: ${index}`)
  } else {
    showToast({
      message: `${app.name}不可用`,
      position: 'top',
      duration: 1500,
    })
  }
}
</script>

<style scoped>
.mobile-desktop {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background-color: #f9f9f9;
  position: relative;
  overflow: hidden;
  color: #323233;
}

/* 加载中容器样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.loading-text {
  margin-top: 15px;
  color: #969799;
  font-size: 14px;
}

/* 空状态容器样式 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* 应用内容区域 */
.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 4px;
  overflow-y: auto;
}

/* 应用图标网格 */
.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 5px;
  margin-top: 12px;
}

.app-icon-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.app-icon-wrapper.disabled {
  opacity: 0.6;
}

.app-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.app-logo {
  width: 54px;
  height: 54px;
  object-fit: contain;
}

.app-icon:active {
  transform: scale(0.9);
}

.app-name {
  font-size: 13px;
  text-align: center;
  color: #323233;
  font-weight: 400;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
}
</style>

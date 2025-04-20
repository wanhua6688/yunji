<template>
  <div class="mobile-desktop">
    <!-- 应用图标区域 -->
    <div class="app-content">
      <!-- 应用图标网格 -->
      <div class="app-grid">
        <div
          v-for="(app, index) in apps"
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
import { showToast } from 'vant'

const router = useRouter()

// 应用图标数据
const apps = ref([
  { name: '设备1', uid: 'a1b2c3d4', canuse: true },
  { name: '设备2', uid: 'e5f6g7h8', canuse: true },
  { name: '设备3', uid: 'i9j0k1l2', canuse: false },
  { name: '设备4', uid: 'm3n4o5p6', canuse: false },
  { name: '设备5', uid: 'q7r8s9t0', canuse: false },
  { name: '设备6', uid: 'u1v2w3x4', canuse: false },
  { name: '设备7', uid: 'y5z6a7b8', canuse: false },
  { name: '设备8', uid: 'c9d0e1f2', canuse: false },
  { name: '设备9', uid: 'g3h4i5j6', canuse: false },
  { name: '设备10', uid: 'k7l8m9n0', canuse: false },
  { name: '设备11', uid: 'o1p2q3r4', canuse: false },
  { name: '设备12', uid: 's5t6u7v8', canuse: false },
  { name: '设备13', uid: 'w9x0y1z2', canuse: false },
  { name: '设备14', uid: 'a3b4c5d6', canuse: false },
  { name: '设备15', uid: 'e7f8g9h0', canuse: false },
  { name: '设备16', uid: 'i1j2k3l4', canuse: false },
  { name: '设备17', uid: 'm5n6o7p8', canuse: false },
  { name: '设备18', uid: 'q9r0s1t2', canuse: false },
  { name: '设备19', uid: 'u3v4w5x6', canuse: false },
  { name: '设备20', uid: 'y7z8a9b0', canuse: false },
])

const handleAppClick = (app, index) => {
  if (app.canuse) {
    // 使用app的uid进行跳转
    router.push({
      name: 'Phone',
      params: { uuid: app.uid },
      query: { deviceName: app.name },
    })
    console.log(`跳转到: ${app.name}, uuid: ${app.uid}, 索引: ${index}`)
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

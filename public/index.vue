<template>
  <div class="device-detail">
    <div class="header">
      <div class="back" @click="goBack">
        <van-icon name="arrow-left" />
        返回
      </div>
    </div>

    <div class="device">
      <iframe :src="url" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, Icon as VanIcon } from 'vant'

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
const deviceList = ref([
  {
    uid: 'e5f6g7h8',
    url: ``,
  },
  {
    uid: 'a1b2c3d4',
    url: ``,
  },
])
// 返回函数
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  showToast({
    message: `已加载设备: ${deviceName.value}`,
    position: 'top',
  })
  console.log('设备参数:', {
    uuid: uuid.value,
    deviceName: deviceName.value,
  })
})
</script>

<style scoped>
.device-detail {
  padding: 16px;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
}

.back {
  display: flex;
  align-items: center;
  color: #2c3e50;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 8px;
}

.back .van-icon {
  margin-right: 4px;
}

h1 {
  margin: 8px 0;
  font-size: 22px;
  font-weight: 500;
  color: #323233;
}

.device-info {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.device-info p {
  margin: 8px 0;
  font-size: 15px;
  color: #646566;
}
</style>

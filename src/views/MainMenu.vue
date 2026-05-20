<template>
     <el-tabs class="mt" type="border-card" v-model="activeTab" @tab-click="handleTabClick">
    <el-tab-pane label="待办中" name="/todo"></el-tab-pane>
    <el-tab-pane label="已完成" name="/did"></el-tab-pane>
    <el-tab-pane label="未完成" name="/undo"></el-tab-pane>
  </el-tabs>
  <router-view/>
</template>

<script setup lang="ts">
import { ref,watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
const route=useRoute()
const router=useRouter()

const activeTab=ref(route.path)  //初始值
// 监听路由变化，同步 activeTab
watch(() => route.path, (newPath) => {
  activeTab.value = newPath
}, { immediate: true })

const handleTabClick=(tab:any) => {
  const path = tab.props.name
  if (path !== route.path) {
    router.push(path)
  }
}

</script>

<style lang="less">


</style>
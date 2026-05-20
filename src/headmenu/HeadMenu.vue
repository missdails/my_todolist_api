<template>
 <div class="header mt mb">
    <el-page-header  >
      <template #content>
        <div>
          <el-avatar style="margin-top: 10px;"
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span > 待办事项网页版应用： </span>
          <span
            style="color: var(--el-text-color-regular)"
          >
            欢迎使用免费版待办事项列表应用！
          </span>
        </div>
      </template>
      <template #extra>
      </template>

    </el-page-header>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less">
.header{
    background-color: white;
    border-radius: 0%;
    height: 60px;
}

</style>
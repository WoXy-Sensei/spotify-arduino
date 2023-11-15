<script setup>

const store = useUserStore()
store.initStore();


</script>
<template>
 <NuxtNotifications position="bottom center" :speed="500" />
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
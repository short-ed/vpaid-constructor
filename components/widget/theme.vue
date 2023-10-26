<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button type="button" @click="toggleDark()">Toggle theme</button>
</template>
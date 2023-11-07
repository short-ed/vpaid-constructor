<script setup lang="ts">
const user = useUser()
</script>

<template>
  <div v-if="user" class="absolute top-0 left-0 w-full h-full grid place-items-center">
    <div class="w-360px">
      <CreativeList />
    </div>
    <!--    <CreativeForm /> -->
  </div>
  <ViewSignIn v-else class="top-[calc(50%-100px)] left-50% absolute" />
</template>

<style scoped>

</style>

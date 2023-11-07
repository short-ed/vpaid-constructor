<script lang="ts" setup>
const user = useUser()
const supabase = useSupabaseClient()
async function signOut() {
  await supabase.auth.signOut()
  user.value = null
}
</script>

<template>
  <div class="w-full h-full min-h-100vh relative z-2 pt-70px">
    <div v-if="user" class="absolute z-10 top-0 left-0 right-0 h-50px bg-white flex items-center justify-between px-2 ring-offset-1 ring-offset-gray-200/75 ring-6 ring-gray-200/20">
      <div />
      <UiButton icon="i-carbon:exit" @click="signOut">
        Выйти
      </UiButton>
    </div>
    <slot />
  </div>
</template>

<style>

</style>

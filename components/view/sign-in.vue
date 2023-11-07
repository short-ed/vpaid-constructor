<script setup lang="ts">
import { LOGIN_PHRASES } from '~/conts/sign-in'

const supabase = useSupabaseClient()

function getRandom(list: string[]) {
  const index = Math.floor(Math.random() * list.length)
  return list[index]
}
const loginPhrase = getRandom(LOGIN_PHRASES)
</script>

<template>
  <div ass="inline-flex items-center justify-center gap-4 relative">
    <span class="flex items-center ws-nowrap font-500 text-sm absolute right-130px h-full ">
      {{ loginPhrase }}
    </span>
    <div class="inline-flex flex-col justify-between gap-2.5 items-center">
      <div class="shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.1)] overflow-hidden  bg-cover bg-50%_50% bg-blend-normal bg-no-repeat w-105px h-8 shrink-0 rounded-md bg-gradient-to-b bg-gradient-from-transparent bg-gradient-to-white" />
      <UiButton icon="i-carbon:logo-github" class="w-120px" @click="supabase.auth.signInWithOAuth({ provider: 'github' })">
        GitHub
      </UiButton>
      <div class="shadow-[0px_-1px_1px_0px_rgba(0,_0,_0,_0.1)] overflow-hidden bg-blend-normal bg-no-repeat w-105px h-8 shrink-0 rounded-md bg-gradient-to-t bg-gradient-from-transparent bg-gradient-to-white" />
    </div>
  </div>
</template>

<style scoped>

</style>

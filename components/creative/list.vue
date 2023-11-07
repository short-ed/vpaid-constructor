<script setup lang="ts">
import type { Tables } from '~/types/database.types'

const creatives = ref<Tables<'creatives'>[]>([])
const supabase = useSupabaseClient()
const user = useUser()
async function fetchCreatives() {
  const { data, error } = await supabase.from('creatives').select('*')
  if (error) {
    console.error(error)
    return
  }
  creatives.value = data
}

onMounted(() => {
  if (user && creatives.value.length === 0)
    fetchCreatives()
})

const {
  isRevealed: isShowForm,
  cancel: cancelCreateCreative,
  confirm: onSaveCreative,
  reveal: showFormCreative,
  onConfirm: handleSaveCreative,
} = useConfirmDialog()

handleSaveCreative(async (creative) => {
  console.log(creative)
})
</script>

<template>
  <div class="ring-offset-1 ring-offset-gray-200/75 ring-6 ring-gray-200/20 overflow-hidden bg-white w-full px-4 py-4 rounded-lg">
    <div v-if="isShowForm">
      <CreativeForm @on-cancel="cancelCreateCreative" @on-save="onSaveCreative" />
    </div>
    <div v-else class="flex flex-col justify-center gap-4">
      <div v-if="creatives.length">
        {{ creatives }}
      </div>
      <div v-else class="grid gap-4 place-items-center">
        <StateNoCreatives />
        <div class="text-center text-16px font-550 leading-[24px] text-[#15191c]">
          Нет созданных креативов.
        </div>
        <div class="text-center text-xs leading-[18px] text-[#15191c] self-start">
          Создай свой первый креатив сейчас
        </div>
      </div>
      <div class="text-center">
        <UiButton icon="i-carbon:magic-wand-filled" @click="showFormCreative">
          Новый креатив
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

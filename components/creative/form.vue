<script setup lang="ts">
import type { Tables } from '~/types/database.types'

const emit = defineEmits<{
  onCancel: []
  onSave: [creative: Tables<'creatives'>]
}>()

function onCancel() {
  emit('onCancel')
}

const creative = reactive({
  name: '',
  video: 'VPAID/videos/3tywwff99a9.mp4',
})

const supabase = useSupabaseClient()
const STORE_BUCKET = 'VPAID'
const STORE_FOLDER_VIDEOS = 'videos'
const isUploading = ref(false)

async function onDrop(files: File[] | null) {
  if (isUploading.value)
    return
  const file = files?.[0]
  if (!file)
    return
  const path = await uploadVideoFile(file)
  if (path)
    creative.video = path
}

const videoFileDropZone = ref<HTMLDivElement>()
const { isOverDropZone } = useDropZone(videoFileDropZone, onDrop)

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || file.type !== 'video/mp4')
    return
  const path = await uploadVideoFile(file)
  if (path)
    creative.video = path
}
async function uploadVideoFile(file: File) {
  try {
    isUploading.value = true
    if (file.size > 10 * 1024 * 1024)
      return alert('Максимальный размер файла 10МБ')
    const isVideoFile = file.type === 'video/mp4'
    const videoFileName = Math.random().toString(36).substring(2)
    const ext = file.name.split('.').pop()
    if (!isVideoFile)
      return
    const { data, error } = await supabase.storage.from(STORE_BUCKET).upload(`${STORE_FOLDER_VIDEOS}/${videoFileName}.${ext}`, file)
    if (error) {
      console.error(error)
      return
    }
    return data.path
  }
  finally {
    isUploading.value = false
  }
}

const isSaving = ref(false)
async function onSave() {
  try {
    if (isSaving.value)
      return
    isSaving.value = true
    const { data, error } = await supabase.from('creatives').insert(creative)
    if (error) {
      console.error(error)
      return
    }
    if (data?.[0])
      emit('onSave', data?.[0])
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div ref="videoFileDropZone" class="flex flex-col justify-center gap-4 w-full">
    <div v-if="isOverDropZone" class="pointer-events-none absolute top-1 right-1 bottom-1 left-1 rounded-md border border-2 bg-white/60 border-dashed grid place-items-center">
      <span class="i-carbon:download w-8 h-8 text-gray-400" />
    </div>
    <label>
      <span class="text-xs text-gray-400 block mb-1">Название креатива</span>
      <input v-model="creative.name" class="block w-full ring ring-light-900 h-8 rounded-md px-4 text-[12px]" type="text" placeholder="Новый креатив">
    </label>
    <div>
      <span class="text-xs text-gray-400 block mb-1">Видео</span>
      <label class="border-2 border-dashed border-gray-200 rounded-lg text-gray-400 cursor-pointer h-30 block">
        <span class="text-balance text-xs grid place-items-center place-content-center gap-2 h-full">
          <span v-if="isUploading" class="flex items-center gap-2">
            <span class="i-carbon:circle-dash animate-spin text-xl" />
            <span>Загрузка файла...</span>
          </span>
          <span v-else-if="creative.video">
            <span>{{ creative.video }}</span>
          </span>
          <span v-else class="flex items-center gap-2">
            <span class="i-carbon:download text-gray-400" />
            <span>
              Загрузите файл
            </span>
          </span>
          <span class="block font-mono text-orange-400/80 text-[10px]">Макс. 10МБ</span>
          <input type="file" class="accessibilitu-hidden" accept="video/mp4" @change="onFileChange">
        </span>
      </label>
    </div>
    <div class="grid grid-cols-[1fr_1fr] gap-4">
      <UiButton @click="onCancel">
        Отмена
      </UiButton>
      <UiButton :icon="isSaving ? 'i-carbon:circle-dash animate-spin' : undefined" @click="onSave">
        Сохранить
      </UiButton>
    </div>
  </div>
</template>

<style scoped>

</style>

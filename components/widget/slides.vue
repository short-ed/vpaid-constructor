<script lang="ts" setup>
import draggable from 'vuedraggable'
import { SlideField } from '~/composables/slide-settings'
import { useStorage } from '@vueuse/core'

const { visibleFields, textOnButton, textOnLink } = useSlideSettings()

const { $supabase } = useNuxtApp()
const config = useRuntimeConfig()
const { supabaseStorageUrl } = config.public

const localSlides = useStorage<{
  id: number
  url: string
  [SlideField.Title]: string
  [SlideField.Image]: string
  [SlideField.Description]: string
  [SlideField.Button]: string
  [SlideField.Link]: string
}[]>('slides', [])

const createSlide = () => {
  const id = localSlides.value.length + 1
  const slide = {
    id,
    url: '',
    [SlideField.Title]: 'Заголовок',
    [SlideField.Image]: `https://picsum.photos/seed/${id}/200/160?random`,
    [SlideField.Description]: 'Описание',
    [SlideField.Button]: 'Кнопка',
    [SlideField.Link]: 'Ссылка'
  }
  localSlides.value.push(slide)
}

// Upload file using standard upload
async function uploadFile(file: File, name: string) {
  const { data, error } = await $supabase.client.storage.from('slide-images').upload(name, file, {
  contentType: 'image/jpeg',
})
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
}

const uploadSlideImage = (e: any, slideId: number) => {
  const file = e.target.files[0]
  console.log(file);
  const name = 'test/'+slideId+'.jpg'
  uploadFile(file, name)
}

const removeSlide = (slideId: number) => {
  const index = localSlides.value.findIndex(slide => slide.id === slideId)
  localSlides.value.splice(index, 1)
}

const copySlide = (slideId: number) => {
  const index = localSlides.value.findIndex(slide => slide.id === slideId)
  const slide = localSlides.value[index]
  const newSlide = {
    id: localSlides.value.length + 1,
    url: slide.url,
    [SlideField.Title]: slide[SlideField.Title],
    [SlideField.Image]: slide[SlideField.Image],
    [SlideField.Description]: slide[SlideField.Description],
    [SlideField.Button]: slide[SlideField.Button],
    [SlideField.Link]: slide[SlideField.Link]
  }
  // Past new slide after current slide
  localSlides.value = [
    ...localSlides.value.slice(0, index + 1),
    newSlide,
    ...localSlides.value.slice(index + 1)
  ]
}
</script>
<template>
  <div>
    <button type="button" class="mb-4 w-full h-9 bg-primary text-xs  text-primary-foreground rounded-2 flex items-center justify-center" @click="createSlide">Добавить слайд</button>
    <draggable :list="localSlides"  group="fields"  :item-key="'id'"  class="min-h-34px border rounded-3 border-dashed p-2 gap-2 grid mb-3">
      <template #item="{element}">
        <div :class="{'grid grid-cols-[60px_1fr] gap-1': visibleFields.includes(SlideField.Image)}">
          <img class="rounded" v-if="visibleFields.includes(SlideField.Image)"  :src="element[SlideField.Image].includes('https') ? element[SlideField.Image] : supabaseStorageUrl + element[SlideField.Image]" alt="">
          <div>
            <input class="border w-full px-1 h-7 rounded text-[12px]" type="text" v-model="element[SlideField.Title]" v-if="visibleFields.includes(SlideField.Title)">
            <input class="border w-full px-1 h-7 rounded text-[12px]" type="text" v-model="element[SlideField.Description]" v-if="visibleFields.includes(SlideField.Description)">
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>


<style>

</style>


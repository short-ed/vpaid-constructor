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
        <div class="p-2 bg-[#f1f1f1] rounded-2 grid gap-1">
          <div v-for="field in visibleFields">
            <div v-if="field === SlideField.Title">
              <input class="w-full text-sm bg-background px-2 rounded-2 text-center text-foreground h-8 flex items-center justify-center font-600" v-model="element[field]"/>
            </div>
            <div v-else-if="field === SlideField.Image">
              <div class="relative w-full h-auto rounded-2 flex items-center justify-center aspect-2/1 border cursor-pointer" >
                <label class="absolute top-0 left-0 w-full h-full hover:bg-white/75 transition-all duration-300  cursor-pointer">
                  <input type="file" class="accessibilitu-hidden  cursor-pointer" @change="(event) => uploadSlideImage(event, element.id)">
                </label>
                <img class="w-full h-auto rounded-2  cursor-pointer" :src="element[field].includes('https') ? element[field] : supabaseStorageUrl + element[field]" />
              </div>
            </div>
            <div v-else-if="field === SlideField.Description">
              <input class="w-full bg-background text-xs px-2 rounded-2 text-center h-8 flex items-center justify-center" v-model="element[field]"/>
            </div>
            <div v-else-if="field === SlideField.Button">
              <div class="w-full h-9 bg-primary text-xs  text-primary-foreground rounded-2 flex items-center justify-center  cursor-default">{{ textOnButton }}</div>
            </div>
            <div v-else-if="field === SlideField.Link">
              <div class="text-center text-primary flex items-center justify-center text-xs underline hover:decoration-none  cursor-default">{{ textOnLink }}</div>
            </div>
            <div v-else>
              {{element[field]}}
            </div>
          </div>
          <input class="w-full text-sm bg-background px-2 rounded-2 text-foreground h-8 mt-2" type="text" placeholder="URL" v-model="element.url" />
          <div class="flex gap-1 justify-center pt-1">
            <button class="w-24px h-24px p-1 rounded-1.5 text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300" type="button" @click="removeSlide(element.id)">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.33 16.5H13.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.5 12.5H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

            </button>

            <button class="w-24px h-24px p-1 rounded-1.5 text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300" type="button" @click="copySlide(element.id)">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

            </button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>


<style>

</style>


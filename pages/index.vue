<script setup lang="ts">
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { useStorage, useDropZone } from '@vueuse/core'
import {vpaidJS} from '~/config/vpaid-js'
const route = useRoute()
const { $supabase} = useNuxtApp()

enum Tab {
  SlideSettings,
  Slides,
}

const localSlides = useStorage<{
  id: number
  url: string
  [SlideField.Title]: string
  [SlideField.Image]: string
  [SlideField.Description]: string
  [SlideField.Button]: string
  [SlideField.Link]: string
}[]>('slides', [])

const currentTab = ref<Tab | undefined>(Tab.Slides)

const onTabChange = (tab?: Tab) => {
  currentTab.value = tab
}

const checkTab = (tab?: Tab) => {
  return currentTab.value === tab
}

const tabButtonStyle = (tab: Tab) => {
  return {
    'bg-accent': currentTab.value === tab,
    'text-accent-foreground': currentTab.value === tab,
    'hover:bg-accent': currentTab.value !== tab,
    'hover:text-accent-foreground': currentTab.value !== tab,
  }
}

const FOLDER = 'test'
const BUCKET = 'slide-images'

const getAllFiles = async () => {
  const files = localSlides.value.map((slide) => {
    return {
      name: slide[SlideField.Image].split('/')[1],
    }
  })

  if (files) {
    const zipFileWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(zipFileWriter, { bufferedWrite: true });
    const promises: any[] = []
    files.forEach((file) => {
      promises.push(
        $supabase.client.storage.from(BUCKET).download(`${FOLDER}/${file.name}`)
      );
    });
    const response = await Promise.allSettled(promises);
    const downloadedFiles = response.map((result, index) => {
      if (result.status === "fulfilled") {
        return {
          name: files[index].name,
          blob: result.value.data,
        };
      }
    });
    downloadedFiles.forEach((downloadedFile) => {
      if (downloadedFile) {
        zipWriter.add('creative/assets/' + downloadedFile.name, new BlobReader(downloadedFile.blob));
      }
    });
    const file = new Blob([vpaidCaroselConfig.value], { type: 'text/plain' });
    zipWriter.add('creative/vpaid.js', new BlobReader(file));
    const url = URL.createObjectURL(await zipWriter.close());
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "creative.zip");
    document.body.appendChild(link);
    link.click();
  }

}


const { visibleFields, textOnButton, textOnLink } = useSlideSettings()

const getVpaidSlideConfig = (slide: {
  id: number
  url: string
  [SlideField.Title]: string
  [SlideField.Image]: string
  [SlideField.Description]: string
  [SlideField.Button]: string
  [SlideField.Link]: string
}, index: number) => {
  return `
    {
      ${visibleFields.value.includes(SlideField.Image) ? `img: 'assets/${slide[SlideField.Image].split('/')[1]}',` : ''}
      ${visibleFields.value.includes(SlideField.Title) ? `title: '${slide[SlideField.Title]}',` : ''}
      ${visibleFields.value.includes(SlideField.Description) ? `description: '${slide[SlideField.Description]}',` : ''}
      ${slide.url ? `url: '${slide.url}',` : ''}
    },
  `.replaceAll('      \n', '')
}

const fieldNames = {
  [SlideField.Title]: 'title',
  [SlideField.Image]: 'image',
  [SlideField.Description]: 'description',
  [SlideField.Button]: 'button',
  [SlideField.Link]: 'link',
}

const getVpaidFieldsCinfig = () => {
  return `
    [${visibleFields.value.map((field) => `'${fieldNames[field]}',`).join('')}]
  `
}

const vpaidCaroselConfig = computed(() => `
const creativeConstructorData = {
  textOnButton: '${textOnButton.value}',
  textOnLink: '${textOnLink.value}',
  fields: ${getVpaidFieldsCinfig()},
  slides: [
    ${localSlides.value.map((slide, index) => getVpaidSlideConfig(slide, index)).join('')}
  ],
}

${vpaidJS}
`)

const dropZoneRef = ref<HTMLDivElement>()

async function uploadFile(file: File, name: string) {
  const { data, error } = await $supabase.client.storage.from('slide-images').upload(name, file, {
  contentType: file.type,
})
  if (error) {
    // Handle error
  } else {
    console.log(data);
    
    // Handle success
  }
}

const imageUploadPromises = ref<{
  id: number
  promise: Promise<any>
}[]>([])
const imageIsUploaded = ref(true)
async function onDrop(files: File[] | null) {
  imageIsUploaded.value = false
  const newSlides: {
    id: number
    url: string
    [SlideField.Title]: string
    [SlideField.Image]: string
    [SlideField.Description]: string
    [SlideField.Button]: string
    [SlideField.Link]: string
  }[] = []
  files?.forEach((file) => {
    const fileName = Math.random().toString(36).substring(7)
    const fileExt = file.name.split('.')[1]
    const name = `${FOLDER}/${fileName}.${fileExt}`
    const id = localSlides.value.length + 1
    imageUploadPromises.value.push({
      id,
      promise: uploadFile(file, name)
    })
    const slide = {
      id,
      url: '',
      [SlideField.Title]: 'Заголовок',
      [SlideField.Image]: `${name}`,
      [SlideField.Description]: 'Описание',
      [SlideField.Button]: 'Кнопка',
      [SlideField.Link]: 'Ссылка'
    }
    newSlides.push(slide)
  })
  const response = await Promise.allSettled(imageUploadPromises.value.map((imageUploadPromise) => imageUploadPromise.promise))
  imageIsUploaded.value = true
  localSlides.value.push(...newSlides)
}

const { isOverDropZone, files } = useDropZone(dropZoneRef, onDrop)
const { pressed } = useMousePressed()

</script>

<template>
  <div class="flex w-full p2 min-h-screen" ref="dropZoneRef">
    <div class="fixed z-10 bg-white/50 w-screen h-screen top-0 left-0 p-10" v-if="!imageIsUploaded">
      <div class="relative w-full h-full border-2px border-primary rounded-xl border-dashed flex items-center justify-center">
        Загрузка изображений...
      </div>
    </div>

    <div class="fixed z-10 bg-white/50 w-screen h-screen top-0 left-0 p-10" v-if="isOverDropZone && !pressed">
      <div class="relative w-full h-full border-2px border-primary rounded-xl border-dashed flex items-center justify-center">
        <svg class="w-15 h-15" viewBox="0 0 24 24" fill="none">
          <path d="M18.63 7.1499C18.67 7.7599 18.62 8.4499 18.5 9.2199L17.77 13.9099C17.15 17.8199 15.34 19.1399 11.43 18.5299L6.73999 17.7899C5.38999 17.5799 4.34999 17.2199 3.58999 16.6799C2.13999 15.6699 1.71999 14.0099 2.11999 11.4499L2.85999 6.7599C3.47999 2.8499 5.28999 1.5299 9.19999 2.1399L13.89 2.8799C17.03 3.3699 18.5 4.6499 18.63 7.1499Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.5 13.4699L19 17.9799C17.75 21.7399 15.75 22.7399 11.99 21.4899L7.48003 19.9899C5.21003 19.2399 3.95003 18.1999 3.59003 16.6799C4.35003 17.2199 5.39003 17.5799 6.74003 17.7899L11.43 18.5299C15.34 19.1399 17.15 17.8199 17.77 13.9099L18.5 9.2199C18.62 8.4499 18.67 7.7599 18.63 7.1499C21.02 8.4199 21.54 10.3399 20.5 13.4699Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.24 8.98C9.20098 8.98 9.98 8.20098 9.98 7.24C9.98 6.27902 9.20098 5.5 8.24 5.5C7.27902 5.5 6.5 6.27902 6.5 7.24C6.5 8.20098 7.27902 8.98 8.24 8.98Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <div class="flex flex-shrink-0 flex-col gap-1 p-2 p">
      <button type="button" class="w-32px aspect-1 p-1.5 rounded-2 transition-all duration-300" :class="tabButtonStyle(Tab.Slides)" @click="onTabChange(Tab.Slides)">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M18 7V17C18 17.62 17.98 18.17 17.91 18.66C17.62 21.29 16.38 22 13 22H11C7.62 22 6.38 21.29 6.09 18.66C6.02 18.17 6 17.62 6 17V7C6 6.38 6.02 5.83 6.09 5.34C6.38 2.71 7.62 2 11 2H13C16.38 2 17.62 2.71 17.91 5.34C17.98 5.83 18 6.38 18 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 17C6 17.62 6.02 18.17 6.09 18.66C5.95 18.67 5.82 18.67 5.67 18.67H5.33C2.67 18.67 2 18 2 15.33V8.66996C2 5.99996 2.67 5.32996 5.33 5.32996H5.67C5.82 5.32996 5.95 5.32996 6.09 5.33996C6.02 5.82996 6 6.37996 6 6.99996V17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 8.66996V15.33C22 18 21.33 18.67 18.67 18.67H18.33C18.18 18.67 18.05 18.67 17.91 18.66C17.98 18.17 18 17.62 18 17V6.99996C18 6.37996 17.98 5.82996 17.91 5.33996C18.05 5.32996 18.18 5.32996 18.33 5.32996H18.67C21.33 5.32996 22 5.99996 22 8.66996Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button type="button" class="w-32px aspect-1 p-1 rounded-2 transition-all duration-300" :class="tabButtonStyle(Tab.SlideSettings)" @click="onTabChange(Tab.SlideSettings)">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M14 17C15.6569 17 17 15.6569 17 14C17 12.3431 15.6569 11 14 11C12.3431 11 11 12.3431 11 14C11 15.6569 12.3431 17 14 17Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 14.8801V13.1201C4 12.0801 4.85 11.2201 5.9 11.2201C7.71 11.2201 8.45 9.94006 7.54 8.37006C7.02 7.47006 7.33 6.30006 8.24 5.78006L9.97 4.79006C10.76 4.32006 11.78 4.60006 12.25 5.39006L12.36 5.58006C13.26 7.15006 14.74 7.15006 15.65 5.58006L15.76 5.39006C16.23 4.60006 17.25 4.32006 18.04 4.79006L19.77 5.78006C20.68 6.30006 20.99 7.47006 20.47 8.37006C19.56 9.94006 20.3 11.2201 22.11 11.2201C23.15 11.2201 24.01 12.0701 24.01 13.1201V14.8801C24.01 15.9201 23.16 16.7801 22.11 16.7801C20.3 16.7801 19.56 18.0601 20.47 19.6301C20.99 20.5401 20.68 21.7001 19.77 22.2201L18.04 23.2101C17.25 23.6801 16.23 23.4001 15.76 22.6101L15.65 22.4201C14.75 20.8501 13.27 20.8501 12.36 22.4201L12.25 22.6101C11.78 23.4001 10.76 23.6801 9.97 23.2101L8.24 22.2201C7.33 21.7001 7.02 20.5301 7.54 19.6301C8.45 18.0601 7.71 16.7801 5.9 16.7801C4.85 16.7801 4 15.9201 4 14.8801Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="flex-shrink-0 pt-2" :class="checkTab(undefined) ? 'w-0' : 'w-280px'">
      <div v-if="checkTab(Tab.SlideSettings)">
        <div class="flex items-center justify-between text-[12px] font-semibold uppercase mb-4 pl-2 pr-0.5">
          <span>Настройка слайда</span>
          <button type="button" class="w-28px aspect-1 p-1 bg-transparent text-foreground hover:text-accent rounded-2 transition-all duration-300" @click="onTabChange()">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.26 15.53L9.74 12L13.26 8.46997" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <WidgetSlideSettings/>
      </div>
      <div v-if="checkTab(Tab.Slides)">
        <div class="flex items-center justify-between text-[12px] font-semibold uppercase mb-4 pl-2 pr-0.5">
          <span>Слайды</span>
          <button type="button" class="w-28px aspect-1 p-1 bg-transparent text-foreground hover:text-accent rounded-2 transition-all duration-300" @click="onTabChange()">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.26 15.53L9.74 12L13.26 8.46997" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="bg-[#f1f1f1] flex flex-row gap-3 w-full py-3 px-3 rounded-2 mb-3">
          <div class="text-[10px] font-medium leading-[10px] uppercase text-[#9294A3]">
            Вы можете перенести на страницу несколько изображений для быстрого создания слайдов
          </div>
          <svg class="self-start w-4 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.53332 12.0267V11.2533C3.99999 10.3267 2.73999 8.52 2.73999 6.6C2.73999 3.3 5.77332 0.713333 9.19999 1.46C10.7067 1.79333 12.0267 2.79333 12.7133 4.17333C14.1067 6.97333 12.64 9.94667 10.4867 11.2467V12.02C10.4867 12.2133 10.56 12.66 9.84666 12.66H6.17332C5.43999 12.6667 5.53332 12.38 5.53332 12.0267Z" stroke="#FCB74F" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.66666 14.6667C7.19332 14.2333 8.80666 14.2333 10.3333 14.6667" stroke="#FCB74F" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="bg-[#f1f1f1] flex flex-row gap-3 w-full py-3 px-3 rounded-2 mb-3">
          <div class="text-[10px] font-medium leading-[10px] uppercase text-[#9294A3]">
            Что бы изменить порядок слайдов, перетащите их в нужном порядке
          </div>
          <svg class="self-start w-4 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.53332 12.0267V11.2533C3.99999 10.3267 2.73999 8.52 2.73999 6.6C2.73999 3.3 5.77332 0.713333 9.19999 1.46C10.7067 1.79333 12.0267 2.79333 12.7133 4.17333C14.1067 6.97333 12.64 9.94667 10.4867 11.2467V12.02C10.4867 12.2133 10.56 12.66 9.84666 12.66H6.17332C5.43999 12.6667 5.53332 12.38 5.53332 12.0267Z" stroke="#FCB74F" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.66666 14.6667C7.19332 14.2333 8.80666 14.2333 10.3333 14.6667" stroke="#FCB74F" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <WidgetSlides/>
      </div>
    </div>
    <div class="flex-1 p-4 overflow-hidden">
      <button class="max-w-full px-4 rounded-2 bg-primary text-primary-foreground h-8 text-xs" type="button" @click="getAllFiles">Скачать архив</button>
      <div class="p-4 border h-420px w-[calc(100%-100px)] overflow-scroll mt-4">
        <pre class="text-xs overflow-hidden max-w-full">{{ vpaidCaroselConfig }}</pre>
      </div>
    </div>
  </div>
</template>

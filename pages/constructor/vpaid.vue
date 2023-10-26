<script setup lang="ts">
import { useVpaidConstructor } from '../../composables/vpaidConstructor'
import draggable from 'vuedraggable'

const { elements, addElement } = useVpaidConstructor()

const generateID = () => {
  return Math.random().toString(36).substr(2, 9)
}

const slides = ref<{
  id: string
  title: SlideElement
  image: SlideElement
  description: SlideElement
  button: SlideElement
  url: string
}[]>([])

interface SlideElement {
  value: string
  order: number
  visible: boolean
}

const addSlide = () => {
  slides.value.push({
    id: generateID(),
    title: {
      value: '',
      order: 0,
      visible: true,
    },
    image: {
      value: 'https://picsum.photos/200/200?random=' + Math.random(),
      order: 1,
      visible: true,
    },
    description: {
      value: '',
      order: 2,
      visible: true,
    },
    button: {
      value: '',
      order: 3,
      visible: true,
    },
    url: '',
  })
}

const slideElementKeys = [
  'title',
  'image',
  'description',
  'button',
] as const

const slidesForDraggable = computed(() => {
  return slides.value.map((slide) => {
    const slideForDraggable: {
      id: string
      elements: Array<{ type: typeof slideElementKeys[number] } & SlideElement>
    } = {
      id: slide.id,
      elements: []
    }
    slideElementKeys.forEach((key) => {
      const el = slide[key]
      slideForDraggable.elements.push({
        type: key,
        ...el
      })
    })
    slideForDraggable.elements = slideForDraggable.elements.sort((a, b) => a.order - b.order)
    return slideForDraggable
  })
})

const updateOrderFieldsSlide = (id: string, elements: { type: typeof slideElementKeys[number] }[]) => {
  const slide = slides.value.find((slide) => slide.id === id)
  if (!slide) return
  elements.forEach((el, index) => {
    slide[el.type].order = index
  })
}

const slideOrderFields = ref([
  {
    id: generateID(),
    type: 'title',
    visible: true,
  },
  {
    id: generateID(),
    type: 'image',
    visible: true,
  },
  {
    id: generateID(),
    type: 'button',
    visible: true,
  },
])

const slideDisabledOrderFields = ref([
{
    id: generateID(),
    type: 'description',
    visible: true,
  },
])
</script>

<template>
  <div class="grid grid-cols-[280px_280px_1fr_280px] h-100vh items-start place-content-start">
    <div class="px-4 py-4 flex flex-col gap-4 items-stretch justify-start w-full">

      <div>
        <div class="flex items-center justify-between text-[12px] font-semibold uppercase mb-4 pl-2">
          <span>Настройка слайда</span>
          <button type="button" class="w-28px aspect-1 p-1 bg-transparent text-foreground hover:text-accent rounded-2 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.26 15.53L9.74 12L13.26 8.46997" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center justify-between text-[10px] font-semibold uppercase mb-2 px-2">
          <span>Расположение элементов</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.7575 2.18999L14.1825 4.15499C15.4575 4.71749 15.4575 5.64749 14.1825 6.20999L9.7575 8.17499C9.255 8.39999 8.43 8.39999 7.9275 8.17499L3.5025 6.20999C2.2275 5.64749 2.2275 4.71749 3.5025 4.15499L7.9275 2.18999C8.43 1.96499 9.255 1.96499 9.7575 2.18999Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.25 8.25C2.25 8.88 2.7225 9.6075 3.3 9.8625L8.3925 12.1275C8.7825 12.3 9.225 12.3 9.6075 12.1275L14.7 9.8625C15.2775 9.6075 15.75 8.88 15.75 8.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.25 12C2.25 12.6975 2.6625 13.3275 3.3 13.6125L8.3925 15.8775C8.7825 16.05 9.225 16.05 9.6075 15.8775L14.7 13.6125C15.3375 13.3275 15.75 12.6975 15.75 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="relative border bg-card rounded-3 p-2 mb-4">
          <draggable :list="slideOrderFields" group="fields" item-key="type">
            <template #item="{element}">
              <div class="px-1 py-1 relative border border-transparent hover:border-accent border-dashed rounded-3 transition-all duration-300 cursor-grabbing">
                <div v-if="element.type === 'title'">
                  <div class="w-full bg-transparent px-2 rounded text-center text-foreground h-8 flex items-center justify-center font-600">Заголовок</div>
                </div>
                <div v-if="element.type === 'image'">
                  <div class="w-full h-auto rounded-2 flex items-center justify-center aspect-1 border" >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.6799 16.9599L18.5499 9.64988C17.4899 7.16988 15.5399 7.06988 14.2299 9.42988L12.3399 12.8399C11.3799 14.5699 9.58993 14.7199 8.34993 13.1699L8.12993 12.8899C6.83993 11.2699 5.01993 11.4699 4.08993 13.3199L2.36993 16.7699C1.15993 19.1699 2.90993 21.9999 5.58993 21.9999H18.3499C20.9499 21.9999 22.6999 19.3499 21.6799 16.9599Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6.96997 8C8.62682 8 9.96997 6.65685 9.96997 5C9.96997 3.34315 8.62682 2 6.96997 2C5.31312 2 3.96997 3.34315 3.96997 5C3.96997 6.65685 5.31312 8 6.96997 8Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>  
                  </div>
                </div>
                <div v-if="element.type === 'description'">
                  <div class="w-full bg-transparent px-2 rounded text-center text-sm h-8 flex items-center justify-center">Описание слайда</div>
                </div>
                <div v-if="element.type === 'button'">
                  <div class="w-full px-2 border rounded-2 text-center text-primary-foreground bg-primary h-8 flex items-center justify-center">Кнопка</div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <div class="flex items-center justify-between text-[10px] font-semibold uppercase mb-2 px-2">
          <span>Скрытые элементы</span>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.8975 7.10244L7.1025 10.8974C6.615 10.4099 6.315 9.74244 6.315 8.99994C6.315 7.51494 7.515 6.31494 9 6.31494C9.7425 6.31494 10.41 6.61494 10.8975 7.10244Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.365 4.32749C12.0525 3.33749 10.5525 2.79749 9 2.79749C6.3525 2.79749 3.885 4.35749 2.1675 7.05749C1.4925 8.11499 1.4925 9.89249 2.1675 10.95C2.76 11.88 3.45 12.6825 4.2 13.3275" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.315 14.6475C7.17 15.0075 8.0775 15.2025 9 15.2025C11.6475 15.2025 14.115 13.6425 15.8325 10.9425C16.5075 9.88501 16.5075 8.10751 15.8325 7.05001C15.585 6.66001 15.315 6.29251 15.0375 5.94751" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.6325 9.52502C11.4375 10.5825 10.575 11.445 9.5175 11.64" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.1025 10.8975L1.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.5 1.5L10.8975 7.1025" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <draggable :list="slideDisabledOrderFields"  group="fields" item-key="type" class="min-h-34px border rounded-3 border-dashed p-2">
            <template #item="{element}">
              <div class="px-1 py-1 relative border border-transparent hover:border-accent border-dashed rounded-3 transition-all duration-300 cursor-grabbing">
                <div v-if="element.type === 'title'">
                  <div class="w-full bg-transparent px-2 rounded text-center text-foreground h-8 flex items-center justify-center font-600">Заголовок</div>
                </div>
                <div v-if="element.type === 'image'">
                  <div class="w-full h-auto rounded-2 flex items-center justify-center aspect-1 border" >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.6799 16.9599L18.5499 9.64988C17.4899 7.16988 15.5399 7.06988 14.2299 9.42988L12.3399 12.8399C11.3799 14.5699 9.58993 14.7199 8.34993 13.1699L8.12993 12.8899C6.83993 11.2699 5.01993 11.4699 4.08993 13.3199L2.36993 16.7699C1.15993 19.1699 2.90993 21.9999 5.58993 21.9999H18.3499C20.9499 21.9999 22.6999 19.3499 21.6799 16.9599Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6.96997 8C8.62682 8 9.96997 6.65685 9.96997 5C9.96997 3.34315 8.62682 2 6.96997 2C5.31312 2 3.96997 3.34315 3.96997 5C3.96997 6.65685 5.31312 8 6.96997 8Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                        
                  </div>
                </div>
                <div v-if="element.type === 'description'">
                  <div class="w-full bg-transparent px-2 rounded text-center text-sm h-8 flex items-center justify-center">Текст описания</div>
                </div>
                <div v-if="element.type === 'button'">
                  <div class="w-full px-2 border rounded-2 text-center text-primary-foreground bg-primary h-8 flex items-center justify-center">Кнопка</div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="text-center">
      <div class="text-xs text-center uppercase mb-2 mt-4">Слайды:</div>
      <button class="px-6 rounded-md h-34px border-dashed border" @click="addSlide">Добавить слайд</button>

    </div>
    <div>

      <div class="w-600px max-w-full flex overflow-hidden">
        <div class="flex-shrink-0 flex-grow-1 min-w-25% max-w25% w-25%" v-for="slide in slidesForDraggable" :key="slide.id">
          <WidgetSlider :id="slide.id" :fields="slide.elements" @update="updateOrderFieldsSlide" />
        </div>
      </div>

      <div class="grid grid-cols-5 gap-y-8 gap-x-4">
        <div v-for="slide in slidesForDraggable" :key="slide.id" class="max-width-full">
          <!-- <WidgetSlider :id="slide.id" :fields="slide.elements" @update="updateOrderFieldsSlide" /> -->
        </div>
      </div>
    </div>
    <div class="pt-8 text-center">
        <button class="px-6 rounded-md h-34px border-dashed border" @click="addSlide">Добавить слайд</button>
      </div>
  </div>
</template>
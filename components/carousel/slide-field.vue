<script lang="ts" setup>
import { SlideField } from '~/composables/slide-settings'
defineProps<{
  field: SlideField
}>()

const { textOnButton, textOnLink } =  useSlideSettings()
</script>
<template>
  <div>
    <div class="px-1 py-1 relative border border-accent border-dashed rounded-2 transition-all duration-300 cursor-grabbing">
      <div v-if="field === SlideField.Title">
        <div class="w-full bg-transparent px-2 rounded text-center text-foreground h-8 flex items-center justify-center font-600">Заголовок</div>
      </div>
      <div v-if="field === SlideField.Image">
        <div class="w-full h-auto rounded-2 flex items-center justify-center aspect-2/1 border" >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6799 16.9599L18.5499 9.64988C17.4899 7.16988 15.5399 7.06988 14.2299 9.42988L12.3399 12.8399C11.3799 14.5699 9.58993 14.7199 8.34993 13.1699L8.12993 12.8899C6.83993 11.2699 5.01993 11.4699 4.08993 13.3199L2.36993 16.7699C1.15993 19.1699 2.90993 21.9999 5.58993 21.9999H18.3499C20.9499 21.9999 22.6999 19.3499 21.6799 16.9599Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.96997 8C8.62682 8 9.96997 6.65685 9.96997 5C9.96997 3.34315 8.62682 2 6.96997 2C5.31312 2 3.96997 3.34315 3.96997 5C3.96997 6.65685 5.31312 8 6.96997 8Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>  
        </div>
      </div>
      <div v-if="field === SlideField.Description">
        <div class="w-full bg-transparent px-2 rounded text-center text-sm h-8 flex items-center justify-center">Текстовое описание</div>
      </div>
      <div v-if="field === SlideField.Button">
        <div class="w-full px-2 border rounded-2 text-sm text-center text-primary-foreground bg-primary h-8 flex items-center justify-center">{{ textOnButton }}</div>
      </div>
      <div v-if="field === SlideField.Link">
        <div class="text-center text-primary flex items-center justify-center text-xs underline hover:decoration-none">{{ textOnLink }}</div>
      </div>

    </div>
  </div>
</template>


<style>

</style>


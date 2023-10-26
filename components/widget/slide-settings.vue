<script setup lang="ts">
import draggable from 'vuedraggable'

const { visibleFields, hiddenFields } =  useSlideSettings()
</script>

<template>
  <div>
    <div class="flex items-center justify-between text-[11px] font-semibold uppercase mb-2 px-2">
      <span>Расположение элементов</span>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.7575 2.18999L14.1825 4.15499C15.4575 4.71749 15.4575 5.64749 14.1825 6.20999L9.7575 8.17499C9.255 8.39999 8.43 8.39999 7.9275 8.17499L3.5025 6.20999C2.2275 5.64749 2.2275 4.71749 3.5025 4.15499L7.9275 2.18999C8.43 1.96499 9.255 1.96499 9.7575 2.18999Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.25 8.25C2.25 8.88 2.7225 9.6075 3.3 9.8625L8.3925 12.1275C8.7825 12.3 9.225 12.3 9.6075 12.1275L14.7 9.8625C15.2775 9.6075 15.75 8.88 15.75 8.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.25 12C2.25 12.6975 2.6625 13.3275 3.3 13.6125L8.3925 15.8775C8.7825 16.05 9.225 16.05 9.6075 15.8775L14.7 13.6125C15.3375 13.3275 15.75 12.6975 15.75 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <draggable :list="visibleFields"  group="fields"  :item-key="'element'"  class="min-h-34px border rounded-3 border-dashed p-2 gap-1 grid mb-3">
      <template #item="{element}">
        <CarouselSlideField :field="element" />
      </template>
    </draggable>
    <div class="flex items-center justify-between text-[11px] font-semibold uppercase mb-2 px-2">
      <span>Скрытые элементы</span>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8975 7.10244L7.1025 10.8974C6.615 10.4099 6.315 9.74244 6.315 8.99994C6.315 7.51494 7.515 6.31494 9 6.31494C9.7425 6.31494 10.41 6.61494 10.8975 7.10244Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.365 4.32749C12.0525 3.33749 10.5525 2.79749 9 2.79749C6.3525 2.79749 3.885 4.35749 2.1675 7.05749C1.4925 8.11499 1.4925 9.89249 2.1675 10.95C2.76 11.88 3.45 12.6825 4.2 13.3275" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.315 14.6475C7.17 15.0075 8.0775 15.2025 9 15.2025C11.6475 15.2025 14.115 13.6425 15.8325 10.9425C16.5075 9.88501 16.5075 8.10751 15.8325 7.05001C15.585 6.66001 15.315 6.29251 15.0375 5.94751" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.6325 9.52502C11.4375 10.5825 10.575 11.445 9.5175 11.64" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.1025 10.8975L1.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.5 1.5L10.8975 7.1025" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <draggable :list="hiddenFields"  group="fields" :item-key="'element'" class="min-h-34px border rounded-3 border-dashed p-2 gap-1 grid mb-6">
      <template #item="{element}">
        <CarouselSlideField :field="element" />
      </template>
    </draggable>
    <div class="bg-[#f1f1f1] flex flex-row gap-3 w-full py-3 px-3 rounded-2">
      <div class="text-[10px] font-medium leading-[10px] uppercase text-[#9294A3]">
        Для скрытия, отображения или изменения порядка отображения элемента,
        перенесите его.
      </div>
      <svg class="self-start w-4 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.53332 12.0267V11.2533C3.99999 10.3267 2.73999 8.52 2.73999 6.6C2.73999 3.3 5.77332 0.713333 9.19999 1.46C10.7067 1.79333 12.0267 2.79333 12.7133 4.17333C14.1067 6.97333 12.64 9.94667 10.4867 11.2467V12.02C10.4867 12.2133 10.56 12.66 9.84666 12.66H6.17332C5.43999 12.6667 5.53332 12.38 5.53332 12.0267Z" stroke="#FCB74F" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.66666 14.6667C7.19332 14.2333 8.80666 14.2333 10.3333 14.6667" stroke="#FCB74F" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>
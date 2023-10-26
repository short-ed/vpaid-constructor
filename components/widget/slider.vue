
<script lang="ts" setup>
import draggable from 'vuedraggable'

const props = defineProps<{
  id: string
  fields: {
    type: 'title' | 'image' | 'description' | 'button'
    value: string
  }[]
}>()
</script>
<template>
  <div class="w-full px-2">
    <div v-for="element in fields">
      <div class="relative">
        <div class="py-1" v-if="element.type === 'title'">
          <div class="w-full bg-transparent px-2 text-foreground font-600 text-center">{{ element.value || 'Заполните заголовок' }}</div>
        </div>
        <div class="py-1" v-if="element.type === 'image'">
          <img class="w-full h-auto rounded" :src="element.value" />
        </div>
        <div class="py-1" v-if="element.type === 'description'">
          <div class="w-full bg-transparent px-2 text-foreground font-400 text-sm text-center">{{ element.value || 'Заполните описание' }}</div>
        </div>
        <div class="py-1" v-if="element.type === 'button'">
          <input placeholder="Кнопка" class="w-full bg-transparent px-2 border border rounded-md h-8 text-center" v-model="element.value" />
        </div>
      </div>
    </div>
  </div>
</template>


<style>

</style>


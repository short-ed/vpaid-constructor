<script lang="ts" setup>
import draggable from 'vuedraggable'

const props = defineProps<{
  id: string
  fields: {
    type: 'title' | 'image' | 'description' | 'button'
    value: string
  }[]
}>()

const emit = defineEmits<{
  update: [id: string, elements: { type: 'title' | 'image' | 'description' | 'button' }[]]
}>()

const list = toRef(props, 'fields')

const onUpdate = (event: { type: 'title' | 'image' | 'description' | 'button' }[]) => {
  emit('update', props.id, event)
}
</script>
<template>
  <div>
    <draggable :modelValue="list" @update:modelValue="onUpdate" item-key="type"         handle=".drag-handler"
>
      <template #item="{element}">
        <div class="pl-6 relative">
          <button class="drag-handler absolute top-1 bottom-1 left-1 w-4 bg-accent rounded cursor-grabbing"></button>
          <div class="py-1" v-if="element.type === 'title'">
            <input class="w-full bg-transparent px-2 border border-dashed rounded text-center" placeholder="Заголовок" v-model="element.value" />
          </div>
          <div class="py-1" v-if="element.type === 'image'">
            <img class="w-full h-auto" :src="element.value" />
          </div>
          <div class="py-1" v-if="element.type === 'description'">
            <input class="w-full bg-transparent px-2 border border-dashed rounded text-center" placeholder="Описание" v-model="element.value" />
          </div>
          <div class="py-1" v-if="element.type === 'button'">
            <input placeholder="Кнопка" class="w-full bg-transparent px-2 border border-dashed rounded text-center" v-model="element.value" />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>


<style>

</style>


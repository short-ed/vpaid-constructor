<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  icon?: string
}>(), {
  type: 'button',
  disabled: false,
})

const icon = computed(() => {
  if (!props.icon)
    return null
  return `${props.icon} ml--0.5`
})
</script>

<template>
  <button :type="type" :disabled="disabled" class="h-9 bg-light-50 shadow-sm ring ring-light-700 ring-offset-light-800 px-6 text-sm font-520 rounded-md hover:(bg-light-200 ring-3 ring-light-700/50 ring-offset-1) transition-all duration-250">
    <span class="flex items-center justify-center gap-2">
      <span v-if="icon" :class="icon" />
      <slot />
    </span>
  </button>
</template>

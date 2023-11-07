<script lang="ts" setup>
import type { Tables } from '~/types/database.types'
import type { Nullable } from '~/types/common.type'

const user = useUser()

const creative = ref <Nullable<Tables<'creatives'>>>(null)
const selectedCreativeId = useLocalStorage<Nullable<number>>('selected-creative-id', null)

const supabase = useSupabaseClient()

async function reloadCreative() {
  const { data, error } = await supabase
    .from('creatives')
    .select('*').single()
  if (error) { console.error(error) }
  else {
    creative.value = {
      id: data.id,
      name: data.name ?? 'Без названия',
      created_at: data.created_at,
      updated_at: data.updated_at,
      type: data.type,
    }
  }
  // creatives.value = data
}

onMounted(() => {
  if (user)
    reloadCreative()
})

const {
  isRevealed: isShowRemoveConfirm,
  reveal: handleRemoveCreative,
  onConfirm: onRemoveCreative,
  confirm: handleConfirmRemoveCreative,
  cancel: handleCancelRemoveCreative,
} = useConfirmDialog<any, { creativeId: number }>()

onRemoveCreative(async ({ creativeId }) => {
  const { error } = await supabase.from('creatives').delete().match({ id: creativeId })
  if (error) { console.error(error) }
  else {
    // creatives.value = creatives.value.filter(creative => creative.id !== creativeId)
    selectedCreativeId.value = null
    creative.value = null
  }
})

const {
  isRevealed: isShowCreativeForm,
  reveal: handleCreateCreative,
  onConfirm: onCreateCreative,
  confirm: handleSaveCreative,
  cancel: handleCancelCreateCreative,
  // onCancel: onCancelCreateCreative,
  onReveal: onOpenCreateCreativeForm,
} = useConfirmDialog<any, { name: string }>()

const creativeName = ref('')
const creativeNameInputEl = ref<HTMLInputElement>()

onOpenCreateCreativeForm(() => {
  nextTick(() => {
    creativeNameInputEl.value?.focus()
  })
})

onCreateCreative(async ({ name }) => {
  const { data, error } = await supabase.from('creatives').insert([
    { name },
  ]).select().single()
  if (error) { console.error(error) }
  else {
    creative.value = {
      id: data.id,
      name: data.name ?? 'Без названия',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      details: {
        carousel: {
          callToAction: {
            type: 'button',
            text: 'Перейти',
          },
          slides: [],
        },
      },
    }
  }
})

const emptyState = computed(() => creative.value === null && !isShowCreativeForm.value)

function onSelectCreative(creativeId: number) {
  if (selectedCreativeId.value !== null)
    return
  selectedCreativeId.value = creativeId
}

function unselectCreative() {
  selectedCreativeId.value = null
}

// const IMAGES_FOLDER = 'images'
// const VIDEOS_FOLDER = 'videos'
// const BUCKET = 'vpaid'

// const isShowUploadHelper = useLocalStorage('isShowUploadHelper', true)
// function hideUploadHelper() {
//   isShowUploadHelper.value = false
// }

const dropZoneRef = ref<HTMLElement>()

// const isShowSelectCreativeModal = ref(false)
// function showSelectCreativeModal() {
//   isShowSelectCreativeModal.value = true
// }
// function hideSelectCreativeModal() {
//   isShowSelectCreativeModal.value = false
// }
// async function onDrop(files: File[] | null) {
//   if (!files)
//     return
//   if (selectedCreativeId.value === null) {
//     showSelectCreativeModal()
//     return
//   }
//   console.log(files)
// }

// const { isOverDropZone, files } = useDropZone(dropZoneRef, onDrop)
// const { pressed } = useMousePressed()

// const editebleCreativeId = ref<number | null>(null)
// const isCreativeNameEditeble = (creativeId: number) => editebleCreativeId.value === creativeId
// function onEditNameCreative(creativeId: number) {
//   const creativeIndex = creatives.value.findIndex(creative => creative.id === creativeId)
//   if (creativeIndex === -1)
//     return
//   editebleCreativeId.value = creativeId
//   nextTick(() => {
//     const input = creativeNameInputRefs.value[creativeIndex]
//     input?.focus()
//   })
// }

// watch(editebleCreativeId, (newValue) => {
//   if (newValue === null) {
//     creatives.value = creatives.value.map((creative) => {
//       if (!creative.name) {
//         return {
//           ...creative,
//           name: 'Без названия',
//         }
//       }
//       return creative
//     })
//   }
// }, {
//   immediate: true,
// })

// function onEditNameCreativeSubmit() {
//   const editebleCreative = creatives.value.find(creative => creative.id === editebleCreativeId.value)
//   if (!editebleCreative?.name)
//     return
//   editebleCreativeId.value = null
// }

function formatDateTime(date: string) {
  const currentDate = new Date(date)
  const day = currentDate.getDate()
  const month = currentDate.getMonth() + 1
  const year = currentDate.getFullYear()
  const hours = currentDate.getHours()
  const minutes = currentDate.getMinutes()
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

// async function handleUploadFiles(event: Event) {
// const { blobReadWriteToken } = config.public
// const files = (event.target as HTMLInputElement).files;
// const file = files?.item(0)
// if (!file) return
// const { url } = await put(file.name, file, { access: 'public', token: blobReadWriteToken });
// }
</script>

<template>
  <div v-if="user === null" class="text-center p-8">
    <div class="text-xs mb-2 font-500">
      Войти при помощи
    </div>
    <UiButton icon="i-carbon:logo-github" @click="supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: 'http://localhost:3000' } })">
      GitHub
    </UiButton>
  </div>
  <Transition name="notif">
    <div
      v-if="user"
      class="shadow-[0px_0px_0px_1px_rgba(0,_0,_0,_0.08)] overflow-hidden bg-[#fafaf9] w-300px p-4 rounded-lg flex flex-row items-start fixed right-[calc(50%-150px)] bottom-16"
    >
      <p class="text-xs text-balance">
        <b class="text-red block">Времено отключено</b> Вы можете перенести видео или изображения на страницу для быстрого создания
        креатива.
      </p>
      <span class="w-18px shrink-0 i-carbon:idea text-[#fe9c76]" />
    </div>
  </Transition>
  <div ref="dropZoneRef" class="w-full min-h-screen p-6 overflow-hidden flex gap-4 items-start">
    <Transition name="notif">
      <div v-if="user" class="w-360px">
        <div
          class="grid gap-16px transition-all duration-500 ease-in-out"
          :class="emptyState ? 'translate-x-0' : 'translate-y--156px'"
        >
          <div
            class="shadow-[0px_0px_0px_1px_rgba(0,_0,_0,_0.08)] bg-[#fafaf9] w-full h-140px grid items-center rounded-lg transition-all duration-500 ease-in-out"
            :class="emptyState ? 'scale-100 opacity-100' : 'scale-75 opacity-0'"
          >
            <div class="text-center text-[#242424]">
              <div class="text-[14px] font-medium mb-2">
                Нет созданных креативов
              </div>
              <button
                type="button" class="mt-4 bg-[#232323] text-white text-xs/4 px-6 rounded-md h-[30px]"
                @click="handleCreateCreative"
              >
                Создать первый креатив
              </button>
            </div>
          </div>
          <div
            class="shadow-[0px_0px_0px_1px_rgba(0,_0,_0,_0.08)] bg-[#fafaf9] w-full p-3 rounded-xl  transition-all duration-500 ease-in-out"
            :class="emptyState ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'"
          >
            <form
              class="shadow-[0px_0px_0px_1px_rgba(0,_0,_0,_0.08)] bg-[#ffffff] w-full py-3 px-5 rounded-lg flex items-center h-72px transition-all duration-300 ease-in-out cursor-pointer" :class="{ 'hover:shadow-[0px_0px_1px_1px_#ef5a3c]': creative, 'shadow-[0px_0px_1px_1px_#ef5a3c]': selectedCreativeId }"
              @submit.prevent="handleSaveCreative({ name: creativeName })"
              @click="creative ? onSelectCreative(creative.id) : () => {}"
            >
              <div
                class="w-full relative transition-all duration-500 ease-in-out"
                :class="isShowCreativeForm ? '' : 'translate-y--10px'"
              >
                <input
                  ref="creativeNameInputEl" v-model="creativeName" type="text"
                  class="w-[calc(100%+24px)] bg-[#0000000a] rounded-[6px] px-3 mx--3 text-[14px] font-500 h-9 outline-0 transition-all duration-500"
                  :placeholder="creative ? '' : 'Название креатива'" :class="isShowCreativeForm ? 'shadow-[0px_0px_2px_0px_#ef5a3c]' : 'bg-transparent shadow-none cursor-pointer'"
                  @blure="handleCancelCreateCreative"
                >
                <div class="absolute w-[calc(100%+24px)] px-3 mx--3 text-[14px] font-500 h-9 outline-0 transition-all duration-500 top-2">
                  {{ creative?.name }}
                </div>
                <div
                  class="absolute bottom--12px left-0 text-10px font-mono font-500 text-[#AFAFAF] transition-all duration-500 ease-in-out"
                  :class="!creative ? 'opacity-0 pointer-events-none ' : 'opacity-100'"
                >
                  {{ creative ? formatDateTime(creative.createdAt) : '-' }}
                </div>
              </div>
              <button
                class="ml--5 relative p-1.5 bg-white rounded-[4px] shadow-[0px_0px_0px_1px_rgba(0,_0,_0,_0.08)] transition-all duration-500"
                type="submit"
                :class="isShowCreativeForm ? 'opacity-100 translate-x-0' : 'translate-x-100% opacity-0'"
              >
                <span class="i-carbon:save block m-0 w-3 h-3" />
              </button>
              <img
                class="absolute right-22px border-4px object-none border-white w-64px h-52px rounded-6px ring-gray-200 ring"
                src="icons/vpaid.svg" alt="VPAID"
                :class="!isShowCreativeForm ? 'opacity-100 translate-x-0' : 'translate-x-100% opacity-0'"
              >
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="notif">
      <div
        v-if="selectedCreativeId && creative"
        class="shadow-[0px_0px_0px_1px_rgba(48,_48,_48,_0.1)] bg-[#fafafa]/75 backdrop-blur-8px flex flex-col justify-center gap-3 w-[320px] p-4 rounded-xl transition-all duration-500"
        :class="{ 'translate-y-10': isShowRemoveConfirm, 'translate-y-0px': !isShowRemoveConfirm }"
      >
        <Transition name="fade">
          <div v-if="isShowRemoveConfirm" class="grid grid-cols-2 gap-4 text-center px-10 absolute bottom-100% pb-1">
            <UiButton class="text-center" @click="handleConfirmRemoveCreative({ creativeId: creative.id })">
              Удалить
            </UiButton>
            <UiButton class="text-center" @click="handleCancelRemoveCreative">
              Отмена
            </UiButton>
          </div>
        </Transition>
        <div class="flex flex-row justify-between items-start">
          <button
            type="button" class="shadow-[0px_0px_1px_0px_#c0c0c0] bg-white p-1 rounded"
            @click="unselectCreative"
          >
            <span class="i-carbon:close block w-4 h-4" />
          </button>
          <button
            type="button" class="shadow-[0px_0px_1px_0px_#c0c0c0] bg-white p-1 rounded"
            @click="handleRemoveCreative"
          >
            <span class="i-carbon:trash-can block w-4 h-4" />
          </button>
        </div>
        <div class="text-sm font-medium tracking-[-0.07] self-start">
          {{ creative.name }}
        </div>
        <label
          class="border-dashed border-[#bdbdbd] overflow-hidden bg-[#f5f5f4] flex flex-col justify-center gap-2 w-full p-3 text-center items-center border rounded-md"
        >
          <!-- <input type="file" class="accessibilitu-hidden" accept="video/mp4" @change="handleUploadFiles"> -->
          <div id="Element1" class="text-xs font-medium text-[#676363]">
            Загрузить файлы
          </div>
          <div class="text-xs font-mono font-medium text-[#fe9c76]">
            ≤10MB
          </div>
        </label>
      </div>
    </Transition>
  </div>
</template>

<style>
.notif-enter-active {
  transition: opacity 0.2s ease 0s, transform 0.3s ease;
}

.notif-leave-active {
  transition: opacity 0.2s ease 0s, transform 0.3s ease;
}

.notif-enter-from,
.notif-leave-to {
  opacity: 0;
}

.notif-enter-from {
  transform: translateY(40px) scale(0.95);
}

.notif-leave-to {
  transform-origin: 50% 0;
  transform: translateY(-20px) scale(0.95);
}

.fade-enter-active {
  transition: opacity 0.2s ease 0s, transform 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.2s ease 0s, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

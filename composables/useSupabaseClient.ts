import { useNuxtApp } from '#imports'

export function useSupabaseClient() {
  return useNuxtApp().$supabase?.client
}

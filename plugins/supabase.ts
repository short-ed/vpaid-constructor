import { createClient } from '@supabase/supabase-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const config = useRuntimeConfig()
    const { supabaseKey, supabaseUrl } = config.public

    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})

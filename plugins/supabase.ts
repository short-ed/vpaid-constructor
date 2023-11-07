import { createClient } from '@supabase/supabase-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import type { Database } from '~/types/database.types'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const config = useRuntimeConfig()
    const { supabaseKey, supabaseUrl } = config.public
    const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
    await supabaseClient.auth.getSession()
    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})

import { put } from '@vercel/blob'

const config = useRuntimeConfig()
const { blobReadWriteToken } = config.public
export default defineEventHandler(async (event) => {
  // const { url } = await put('vpaid-video.mp4', body: undefined, { access: 'public', token: blobReadWriteToken });
  // return { url }
})

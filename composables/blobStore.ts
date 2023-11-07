import { upload } from '@vercel/blob/client'

export function useBlobStore() {
  const config = useRuntimeConfig()
  async function sendFileToBlobStore(file: File) {
    const { url } = await upload(`articles/${file.name}`, file, { access: 'public', handleUploadUrl: '/api/video/upload' })
    return url
  }

  return {
    sendFileToBlobStore,
  }
}

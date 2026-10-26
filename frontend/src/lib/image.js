// Phone photos are often 4 to 12 MB: far more than identification needs, and
// more than Vercel accepts in one request (4.5 MB).
const MAX_SIDE = 2048
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024
const JPEG_QUALITY = 0.88

export async function prepareForUpload(file) {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('This photo could not be opened. Try a different one.')
  })

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size <= SKIP_BELOW_BYTES) {
    bitmap.close()
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
  // A small, already-compressed photo can come out bigger as a JPEG.
  if (blob.size >= file.size) return file
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' })
}

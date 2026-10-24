// Phone photos are often 4 to 12 MB, more than identification needs and more
// than some hosts accept in one request (Vercel functions stop at 4.5 MB).
// Shrink big photos in the browser before uploading them.
const MAX_SIDE = 2048
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024
const JPEG_QUALITY = 0.88

export async function prepareForUpload(file) {
  if (typeof createImageBitmap !== 'function') return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file // Undecodable here: let the server have the final word.
  }

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
  if (!blob || blob.size >= file.size) return file
  const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
  return new File([blob], `${name}.jpg`, { type: 'image/jpeg' })
}

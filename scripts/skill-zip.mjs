const CRC_TABLE = new Uint32Array(256)
for (let index = 0; index < 256; index += 1) {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  CRC_TABLE[index] = value >>> 0
}

export function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function dosDateTime(date) {
  const year = Math.max(date.getUTCFullYear(), 1980)
  const dosDate = ((year - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate()
  const dosTime = (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | Math.floor(date.getUTCSeconds() / 2)
  return { dosDate, dosTime }
}

function writeUint32(view, offset, value) {
  view.setUint32(offset, value, true)
}

function writeUint16(view, offset, value) {
  view.setUint16(offset, value, true)
}

/** 无压缩 ZIP。文件名使用 UTF-8。 */
export function buildStoredZip(entries, modifiedAt = new Date('2026-10-18T12:00:00Z')) {
  const { dosDate, dosTime } = dosDateTime(modifiedAt)
  const locals = []
  const centrals = []
  let offset = 0

  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8')
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data)
    const checksum = crc32(data)
    const local = Buffer.alloc(30 + name.length + data.length)
    const localView = new DataView(local.buffer, local.byteOffset, local.byteLength)
    writeUint32(localView, 0, 0x04034b50)
    writeUint16(localView, 4, 20)
    writeUint16(localView, 6, 0x0800)
    writeUint16(localView, 8, 0)
    writeUint16(localView, 10, dosTime)
    writeUint16(localView, 12, dosDate)
    writeUint32(localView, 14, checksum)
    writeUint32(localView, 18, data.length)
    writeUint32(localView, 22, data.length)
    writeUint16(localView, 26, name.length)
    writeUint16(localView, 28, 0)
    name.copy(local, 30)
    data.copy(local, 30 + name.length)
    locals.push(local)

    const central = Buffer.alloc(46 + name.length)
    const centralView = new DataView(central.buffer, central.byteOffset, central.byteLength)
    writeUint32(centralView, 0, 0x02014b50)
    writeUint16(centralView, 4, 20)
    writeUint16(centralView, 6, 20)
    writeUint16(centralView, 8, 0x0800)
    writeUint16(centralView, 10, 0)
    writeUint16(centralView, 12, dosTime)
    writeUint16(centralView, 14, dosDate)
    writeUint32(centralView, 16, checksum)
    writeUint32(centralView, 20, data.length)
    writeUint32(centralView, 24, data.length)
    writeUint16(centralView, 28, name.length)
    writeUint16(centralView, 30, 0)
    writeUint16(centralView, 32, 0)
    writeUint16(centralView, 34, 0)
    writeUint16(centralView, 36, 0)
    writeUint32(centralView, 38, 0)
    writeUint32(centralView, 42, offset)
    name.copy(central, 46)
    centrals.push(central)
    offset += local.length
  }

  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0)
  const end = Buffer.alloc(22)
  const endView = new DataView(end.buffer, end.byteOffset, end.byteLength)
  writeUint32(endView, 0, 0x06054b50)
  writeUint16(endView, 4, 0)
  writeUint16(endView, 6, 0)
  writeUint16(endView, 8, entries.length)
  writeUint16(endView, 10, entries.length)
  writeUint32(endView, 12, centralSize)
  writeUint32(endView, 16, offset)
  writeUint16(endView, 20, 0)
  return Buffer.concat([...locals, ...centrals, end])
}

export function readStoredZip(buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
  const files = []
  let offset = 0
  while (offset + 4 <= buffer.length) {
    const signature = view.getUint32(offset, true)
    if (signature !== 0x04034b50) break
    const method = view.getUint16(offset + 8, true)
    const compressedSize = view.getUint32(offset + 18, true)
    const nameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)
    const nameStart = offset + 30
    const dataStart = nameStart + nameLength + extraLength
    const name = buffer.subarray(nameStart, nameStart + nameLength).toString('utf8')
    const data = buffer.subarray(dataStart, dataStart + compressedSize)
    if (method !== 0) throw new Error(`zip 条目 ${name} 不是存储方式`)
    files.push({ name, data: Buffer.from(data) })
    offset = dataStart + compressedSize
  }
  if (!files.length) throw new Error('zip 里没有文件')
  return files
}

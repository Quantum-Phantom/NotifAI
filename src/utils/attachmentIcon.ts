const EXTENSION_ICON_GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['$filePdf', ['pdf']],
  ['$fileWord', ['doc', 'docx', 'rtf', 'odt']],
  ['$fileExcel', ['xls', 'xlsx', 'csv', 'ods']],
  ['$filePowerpoint', ['ppt', 'pptx', 'odp']],
  [
    '$fileImage',
    ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tif', 'tiff', 'heic', 'ico', 'avif'],
  ],
  ['$fileMusic', ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma']],
  ['$fileVideo', ['mp4', 'avi', 'mov', 'mkv', 'webm', 'wmv', 'flv', 'm4v', 'mpg', 'mpeg']],
  ['$folderZip', ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz']],
  ['$textBox', ['txt', 'md', 'log']],
  [
    '$fileCode',
    [
      'json',
      'xml',
      'yaml',
      'yml',
      'html',
      'htm',
      'css',
      'js',
      'ts',
      'py',
      'java',
      'c',
      'cpp',
      'sql',
      'sh',
      'ini',
      'toml',
    ],
  ],
]

const EXTENSION_ICON_MAP: ReadonlyMap<string, string> = new Map(
  EXTENSION_ICON_GROUPS.flatMap(([icon, extensions]) =>
    extensions.map((extension) => [extension, icon] as const),
  ),
)

export const FALLBACK_ATTACHMENT_ICON = '$fileDownload'

const EXTENSION_PATTERN = /\.([a-z0-9]+)$/i

function extractExtension(value: string): string {
  const [path] = value.split(/[?#]/, 1)
  const match = EXTENSION_PATTERN.exec((path ?? '').trim())
  return match ? match[1].toLowerCase() : ''
}

function decodeSafely(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function extractUrlExtension(url: string): string {
  const [path] = url.split(/[?#]/, 1)
  const lastSegment = (path ?? '').split('/').pop() ?? ''
  return extractExtension(decodeSafely(lastSegment))
}

/** 根据附件文件名或 URL 推断展示图标，未知类型回退到通用下载图标。 */
export function getAttachmentIcon(name: string, url: string): string {
  return (
    EXTENSION_ICON_MAP.get(extractExtension(name)) ??
    EXTENSION_ICON_MAP.get(extractUrlExtension(url)) ??
    FALLBACK_ATTACHMENT_ICON
  )
}

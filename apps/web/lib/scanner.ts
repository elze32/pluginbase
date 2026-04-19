const PLUGIN_EXTENSIONS = ['.vst3', '.vst', '.clap', '.dll']

export interface ScannedPlugin {
  name: string
  format: string
  path: string
}

export async function scanDirectory(
  dirHandle: FileSystemDirectoryHandle,
  results: ScannedPlugin[],
  onProgress: (state: { found: number; folder: string }) => void,
  depth = 0
): Promise<void> {
  if (depth > 5) return

  try {
    for await (const handle of dirHandle.values()) {
      const name = handle.name

      if (handle.kind === 'file') {
        const ext = getExtension(name)
        if (PLUGIN_EXTENSIONS.includes(ext)) {
          const cleanName = name.replace(/\.(vst3|vst|clap|dll)$/i, '').trim()
          if (cleanName.length < 2) continue

          results.push({
            name: cleanName,
            format: ext,
            path: `${dirHandle.name}/${name}`,
          })

          onProgress({ found: results.length, folder: dirHandle.name })
        }

        continue
      }

      const ignoredDirs = ['Windows', 'System32', 'node_modules', '.git']
      if (ignoredDirs.includes(name)) continue

      await scanDirectory(handle as FileSystemDirectoryHandle, results, onProgress, depth + 1)
    }
  } catch {
    // Dossier inaccessible : on continue le scan.
  }
}

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return ''
  return filename.slice(lastDot).toLowerCase()
}

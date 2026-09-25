// retain.js：保留与恢复（基线：不回收、直接从空清单恢复）
export function retain(segments, policy) {
  return { kept: segments.map((segment) => segment.id), dropped: [] };
}

export function recover(manifest, onDisk) {
  return { segments: onDisk.slice(), orphans: [] };
}

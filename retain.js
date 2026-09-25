// retain.js：保留与恢复（按 max_count 与 max_bytes 双上限回收，清单为准恢复）
export function retain(segments, policy) {
  const kept = segments.slice();
  const dropped = [];
  const totalBytes = () => kept.reduce((sum, segment) => sum + segment.bytes, 0);
  while (kept.length > 1 &&
         (kept.length > policy.max_count || totalBytes() > policy.max_bytes)) {
    dropped.push(kept.shift().id);
  }
  return { kept: kept.map((segment) => segment.id), dropped: dropped };
}

export function recover(manifest, onDisk) {
  if (!manifest || typeof manifest !== "object" ||
      !Array.isArray(manifest.segments) ||
      manifest.segments.some((id) => typeof id !== "string")) {
    const error = new Error("manifest missing or corrupt");
    error.code = "E_MANIFEST_BAD";
    throw error;
  }
  const listed = new Set(manifest.segments);
  return { segments: manifest.segments.slice(),
           orphans: onDisk.filter((id) => !listed.has(id)) };
}

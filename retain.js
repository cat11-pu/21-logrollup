// retain.js：按预算回收已封口段；按清单恢复
export function retain(segments, policy) {
  // 顺序即年代：最老在最前，最后一段是永不回收的当前段
  const kept = segments.slice();
  const dropped = [];

  while (kept.length > 1) {
    const bytes = kept.reduce((sum, segment) => sum + segment.bytes, 0);
    if (kept.length <= policy.max_count && bytes <= policy.max_bytes) break;
    dropped.push(kept.shift().id); // 从最老的已封口段开始删
  }

  return { kept: kept.map((segment) => segment.id), dropped };
}

export function recover(manifest, onDisk) {
  if (manifest === null || typeof manifest !== "object" ||
      !Array.isArray(manifest.segments)) {
    const error = new Error("manifest missing or corrupt");
    error.code = "E_MANIFEST_BAD";
    throw error;
  }

  const listed = manifest.segments;
  const orphans = onDisk.filter((id) => !listed.includes(id));
  return { segments: listed.slice(), orphans };
}

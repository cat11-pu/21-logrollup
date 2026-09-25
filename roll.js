// roll.js：分段滚动（基线：全部写进一个段）
export function write(segments, sizeLimit, millisLimit, records) {
  const total = records.reduce((sum, record) => sum + record.bytes, 0);
  return { segments: [{ id: "s0", bytes: total, from: records[0].millis, to: records[records.length - 1].millis }],
           closed: [], current: "s0" };
}

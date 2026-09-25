// roll.js：分段滚动（按大小与时间滚动，封口段不再追加）
export function write(segments, sizeLimit, millisLimit, records) {
  const result = segments.slice();
  let current = result[result.length - 1] || null;
  for (const record of records) {
    if (current === null) {
      current = { id: "s" + result.length, bytes: 0, from: record.millis, to: record.millis };
      result.push(current);
    } else if (current.bytes > 0 &&
               (current.bytes + record.bytes > sizeLimit ||
                record.millis - current.from > millisLimit)) {
      current = { id: "s" + result.length, bytes: 0, from: record.millis, to: record.millis };
      result.push(current);
    }
    current.bytes += record.bytes;
    current.to = record.millis;
  }
  const closed = result.slice(0, -1).map((segment) => segment.id);
  return { segments: result, closed: closed, current: current ? current.id : null };
}

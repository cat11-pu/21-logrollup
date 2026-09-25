// roll.js：逐条写入，按字节与时间跨度滚动封口
export function write(segments, sizeLimit, millisLimit, records) {
  // 入参段只读：拷贝后再追加，最后一段视为当前（可写）段
  const list = segments.map((segment) => ({ id: segment.id, bytes: segment.bytes,
                                           from: segment.from, to: segment.to }));

  for (const record of records) {
    let current = list[list.length - 1];
    if (current !== undefined &&
        (current.bytes + record.bytes > sizeLimit ||
         record.millis - current.from > millisLimit)) {
      // 当前段再追加就越界：封口，下一条落到新段
      current = undefined;
    }
    if (current === undefined) {
      current = { id: "s" + list.length, bytes: 0, from: record.millis, to: record.millis };
      list.push(current);
    }
    current.bytes += record.bytes;
    current.to = record.millis;
  }

  const current = list.length ? list[list.length - 1].id : null;
  const closed = list.slice(0, -1).map((segment) => segment.id);
  return { segments: list, closed, current };
}

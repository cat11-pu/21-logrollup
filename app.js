// app.js：渲染结果
import { write } from "./roll.js";
import { retain } from "./retain.js";

export function render(spec) {
  const rolled = write([], spec.size_limit, spec.millis_limit, spec.records);
  const kept = retain(rolled.segments, spec.policy);
  const byId = new Map(rolled.segments.map((segment) => [segment.id, segment]));
  const bytes = kept.kept.reduce((sum, id) => sum + byId.get(id).bytes, 0);
  return { segments: rolled.segments.map((segment) => segment.id), closed: rolled.closed,
           current: rolled.current, kept: kept.kept, dropped: kept.dropped, bytes };
}

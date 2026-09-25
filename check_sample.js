import fs from "node:fs";
import { write } from "./roll.js";
import { retain, recover } from "./retain.js";
import { render } from "./app.js";

const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/log.json", "utf8"));
const rolled = write([], spec.size_limit, spec.millis_limit, spec.records);
const kept = retain(rolled.segments, spec.policy);
const back = recover(spec.manifest, spec.on_disk);
const out = render(spec);

console.log("段列表 =", JSON.stringify(rolled.segments.map((segment) => segment.id)));
console.log("已关闭的段 =", JSON.stringify(rolled.closed));
console.log("当前段 =", rolled.current);
console.log("保留的段 =", JSON.stringify(kept.kept));
console.log("回收的段 =", JSON.stringify(kept.dropped));
console.log("总字节 =", out.bytes);
console.log("恢复后的段 =", JSON.stringify(back.segments));
console.log("孤儿段 =", JSON.stringify(back.orphans));
console.log("清单损坏的错误码 =", spec.manifest_code);

import assert from "node:assert";
import { write } from "../roll.js";
import { retain, recover } from "../retain.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok   " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const records = [{ bytes: 10, millis: 0 }, { bytes: 20, millis: 5 }];

check("write returns segments", () => {
  assert.ok(Array.isArray(write([], 100, 1000, records).segments));
});

check("write reports current segment", () => {
  assert.strictEqual(typeof write([], 100, 1000, records).current, "string");
});

check("retain splits kept and dropped", () => {
  const out = retain([{ id: "s0", bytes: 10, from: 0, to: 1 }], { max_count: 1, max_bytes: 100 });
  assert.ok(Array.isArray(out.kept) && Array.isArray(out.dropped));
});

check("recover returns segments", () => {
  assert.ok(Array.isArray(recover({ segments: [] }, []).segments));
});

check("render exposes bytes", () => {
  assert.strictEqual(typeof render({ records: records, size_limit: 100, millis_limit: 1000,
                                    policy: { max_count: 2, max_bytes: 1000 } }).bytes, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);

import { normalizeCompactSource } from "./normalizer-v2.js";
import { normalizeMotionSource } from "./motion3.js";

export function normalizeSource(source) {
  const authoredSource = String(source ?? "");
  const compact = normalizeCompactSource(authoredSource);
  const motion = normalizeMotionSource(compact.source);
  return Object.freeze({
    source: motion.source,
    used: compact.used || motion.used,
    compactUsed: compact.used,
    motionUsed: motion.used,
    design: compact.design,
    motion,
    features: Object.freeze({
      ...compact.features,
      ...motion.features
    })
  });
}

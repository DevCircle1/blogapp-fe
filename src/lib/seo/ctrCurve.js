/**
 * Expected organic click-through rate by average position.
 *
 * These are APPROXIMATE, generic values in line with the range published by
 * industry CTR studies (position 1 at roughly a quarter of clicks, falling
 * steeply through the top ten and to around 1% by the bottom of page two).
 * Real CTR varies with query type, SERP features, brand strength and device, so
 * every figure derived from this curve is an estimate, and the UI says so. It is
 * a single table on purpose: change it here and every tool follows.
 */
const TOP_TEN = [0.276, 0.158, 0.11, 0.084, 0.063, 0.049, 0.039, 0.033, 0.027, 0.024];

/** Expected CTR (0–1) at a Search Console average position. */
export function expectedCtr(position) {
  if (!Number.isFinite(position) || position < 1) return TOP_TEN[0];
  if (position <= 10) {
    // Linear interpolation between whole positions: 3.4 sits between #3 and #4.
    const lower = Math.floor(position);
    const upper = Math.min(10, lower + 1);
    return TOP_TEN[lower - 1] + (TOP_TEN[upper - 1] - TOP_TEN[lower - 1]) * (position - lower);
  }
  if (position <= 20) return 0.024 - ((position - 10) / 10) * 0.014; // 2.4% at #10 → 1.0% at #20
  return Math.max(0.001, 0.01 - ((position - 20) / 30) * 0.008);
}

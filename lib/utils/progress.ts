/**
 * 🛠️ DRKCNAY ELITE - TERMINAL PROGRESS UTILITY
 * Pure ANSI-based progress bar for high-performance terminal tracking.
 */

export function showProgressBar(current: number, total: number, label: string = "Processing") {
  const width = 30;
  const percentage = Math.round((current / total) * 100);
  const progress = Math.round((width * current) / total);
  
  const empty = width - progress;
  const bar = "█".repeat(progress) + "░".repeat(empty);
  
  // Clear line and write back
  process.stdout.write(`\r🛸 ${label}: [${bar}] ${percentage}% (${current}/${total})`);
  
  if (current === total) {
    process.stdout.write("\n✅ Operation Complete.\n");
  }
}

export function updateProgress(percentage: number, label: string = "Working") {
  const width = 30;
  const progress = Math.round((width * percentage) / 100);
  const empty = width - progress;
  const bar = "█".repeat(progress) + "░".repeat(empty);
  
  process.stdout.write(`\r⚡ ${label}: [${bar}] ${percentage}%`);
  
  if (percentage >= 100) {
    process.stdout.write("\n✅ Done.\n");
  }
}

(function() {
  console.warn("🛡️ Next.js Chunk Recovery Shield Active. Triggering hot reload...");
  if (typeof window !== 'undefined') {
    var now = Date.now();
    var lastReload = sessionStorage.getItem('chunk_recovery_reload');
    // Limit reload to once every 15 seconds to prevent any infinite loops
    if (!lastReload || (now - parseInt(lastReload, 10) > 15000)) {
      sessionStorage.setItem('chunk_recovery_reload', now.toString());
      window.location.reload();
    }
  }
})();

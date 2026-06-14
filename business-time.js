// ════════════════════════════════════════════════
// business-time.js - Controls the Live Open/Closed Status
// ════════════════════════════════════════════════

function updateBusinessStatus() {
  const text = document.getElementById('live-text');
  const dot = document.getElementById('live-dot');
  if (!text || !dot) return;
  
  const d = new Date();
  // Automatically pull Indian Standard Time (IST)
  const localTime = new Date(d.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const hour = localTime.getHours();
  const day = localTime.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  // Business hours: Mon-Sat (Days 1-6), 9:00 AM to 6:00 PM (Hours 9 to 17)
  const isOpen = (day !== 0) && (hour >= 9 && hour < 18);
  
  if (isOpen) {
    text.textContent = "We are Open Now";
    text.style.color = "var(--green3)";
    dot.style.background = "#22c55e"; // Glowing green
    dot.style.boxShadow = "0 0 8px #22c55e";
  } else {
    text.textContent = "Currently Closed";
    text.style.color = "var(--red)";
    dot.style.background = "var(--red)";
    dot.style.boxShadow = "none";
  }
}

// Run immediately when loaded, then update every 60 seconds
document.addEventListener('DOMContentLoaded', () => {
  updateBusinessStatus();
  setInterval(updateBusinessStatus, 60000);
});

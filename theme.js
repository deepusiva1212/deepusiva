// --- 🌓 UNIVERSAL THEME BRAIN ---
document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#checkbox');
    const storedTheme = localStorage.getItem('theme');

    // 1. Apply saved theme on page load
    if (storedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (toggleSwitch) toggleSwitch.checked = true;
    }

    // 2. Listen for clicks
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});

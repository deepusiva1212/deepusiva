// --- 🌓 UNIVERSAL THEME BRAIN ---
document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#checkbox');
    const storedTheme = localStorage.getItem('theme');

    // 1. Apply saved theme on page load
    if (storedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (toggleSwitch) toggleSwitch.checked = true;
    }

    // 2. Listen for clicks to flip the switch
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                console.log("Switching to Light Mode");
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                console.log("Switching to Dark Mode");
            }
        });
    } else {
        console.error("Theme Switch Error: Could not find the checkbox ID!");
    }
});

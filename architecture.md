# `deepusiva.com` - Public Website Architecture

## 1. Core Technology
* Frontend: HTML5, CSS3, JavaScript (ES Modules).
* Hosting: GitHub Pages.
* Lead Capture: Web3Forms (integrated securely via `config.js` injection).
* Analytics: Google Analytics 4 (tracking `generate_lead` events).

## 2. Directory Structure
* `index.html`: The main landing page (Hero, About Us, Services, Portfolio, Contact).
* `style.css`: The primary stylesheet (uses Industrial Green `#16a34a` branding).
* `loader.css`: Standalone stylesheet for the initial "Smart Loader" animation.
* `404.html`: Custom branded error page.
* `config.js`: Security vault holding Web3Forms Access Key and Admin Emails (injected at runtime).
* `/assets/`: Folder containing images, logos, and icons.

## 3. Key Components (`index.html`)
* **Header/Nav**: Sticky navigation with smooth scrolling to sections.
* **Hero Section**: High-impact banner with a primary Call to Action (CTA) and dynamic background.
* **Services Grid**: Cards detailing Fabrication, PEB, Solar, and Welding services.
* **Portfolio Gallery**: Visual showcase of past industrial projects.
* **Stats Counter**: Animated numbers (Years in Business, Projects Completed) that trigger on scroll.
* **Contact Form**: Uses Web3Forms with hCaptcha enabled for spam protection. Captures Name, Phone, Service Type, and Message.
* **Floating Video Widget**: Optional floating container for YouTube/Instagram reel embeds.
* **Footer**: Quick links, physical address, and dynamic social media links.

## 4. AI & Assistant Guidelines
* When generating new content for the site, maintain a professional, "Industrial Grade," and engineering-focused tone.
* Never hardcode API keys directly into HTML forms; always use the `config.js` injector pattern.
* Ensure all new pages include the correct `robots.txt` and `sitemap.xml` references for SEO.

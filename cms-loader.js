// ═══════════════════════════════════════════════════════
//  DEEPU SIVA — CMS Loader (cms-loader.js)
//  Add this script to index.html just before </body>
//  It dynamically loads:
//   1. Portfolio projects from Firestore
//   2. Floating video widget (YouTube / Instagram)
//   3. Social media footer links
// ═══════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCm0UfXGcDiXk8dmGZ8coKOnnVmaJl6mB0",
  authDomain:        "deepu-siva-portal.firebaseapp.com",
  projectId:         "deepu-siva-portal",
  storageBucket:     "deepu-siva-portal.firebasestorage.app",
  messagingSenderId: "1014351018202",
  appId:             "1:1014351018202:web:16d2578f726159e5ef8de3"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── 1. LOAD PORTFOLIO ───────────────────────────────
// Replaces the static projects grid on index.html
// The grid must have id="dynamicProjectsGrid"
async function loadPortfolio() {
  const grid = document.getElementById('dynamicProjectsGrid');
  if (!grid) return;

  try {
    const snap = await getDocs(
      query(collection(db, 'portfolio'), orderBy('order','asc'), limit(6))
    );

    if (snap.empty) return; // Keep static fallback if no Firestore projects

    // Category colours for project thumbnails
    const catColors = {
      'Metal Fabrication':    'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
      'Industrial Roofing':   'linear-gradient(135deg,#fff8e1,#ffecb3)',
      'Solar Structures':     'linear-gradient(135deg,#e3f2fd,#bbdefb)',
      'Structural Engineering':'linear-gradient(135deg,#fce4ec,#f8bbd0)',
      'Industrial Construction':'linear-gradient(135deg,#f3e5f5,#e1bee7)',
      'Erection & Installation':'linear-gradient(135deg,#e0f7fa,#b2ebf2)',
    };
    const catIcons = {
      'Metal Fabrication':    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>',
      'Industrial Roofing':   '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
      'Solar Structures':     '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
      'Structural Engineering':'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    };
    const defaultIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

    grid.innerHTML = snap.docs.map(d => {
      const p   = d.data();
      const bg  = catColors[p.category] || 'linear-gradient(135deg,#e8f5e9,#c8e6c9)';
      const ico = catIcons[p.category]  || defaultIcon;

      return `
        <a href="project.html?id=${d.id}" class="proj-card" style="text-decoration:none;">
          <div class="proj-thumb" style="background:${bg};">
            ${p.imageUrl
              ? `<img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"/>`
              : `<div class="proj-thumb-icon">${ico}</div>`}
          </div>
          <div class="proj-info">
            <div class="proj-cat">${p.category || 'Project'}</div>
            <h4>${p.title}</h4>
            <p>${(p.shortDesc || '').substring(0,80)}${(p.shortDesc||'').length > 80 ? '…' : ''}</p>
          </div>
        </a>`;
    }).join('');
  } catch(e) {
    // Silently fail — static content remains visible
    console.warn('CMS: Portfolio load failed, using static content.', e.message);
  }
}

// ── 2. FLOATING VIDEO WIDGET ────────────────────────
// Creates a floating bottom-right widget if a URL is set in cms/settings
async function loadVideoWidget() {
  try {
    const snap = await getDoc(doc(db, 'cms', 'settings'));
    if (!snap.exists()) return;

    const videoUrl = snap.data().videoUrl || '';
    if (!videoUrl) return;

    const embedUrl = getEmbedUrl(videoUrl);
    if (!embedUrl) return;

    // Build the widget
    const widget = document.createElement('div');
    widget.id = 'cmsVideoWidget';
    widget.innerHTML = `
      <style>
        #cmsVideoWidget {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 280px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,.2);
          z-index: 850;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,.1);
          transition: transform .3s, opacity .3s;
        }
        #cmsVideoWidget.minimised { transform: scale(0.1) translateX(200px) translateY(200px); opacity: 0; pointer-events: none; }
        #vw-header {
          background: #16a34a;
          color: #fff;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: sans-serif;
          font-size: 13px;
          font-weight: 700;
        }
        #vw-header span { opacity: .9; font-size: 12px; }
        #vw-close, #vw-toggle {
          background: rgba(255,255,255,.2);
          border: none;
          color: #fff;
          width: 24px; height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        #vw-close:hover, #vw-toggle:hover { background: rgba(255,255,255,.35); }
        #vw-frame { display: block; width: 100%; height: 168px; border: none; }
        @media (max-width: 768px) {
          #cmsVideoWidget { width: 240px; bottom: 76px; right: 12px; }
          #vw-frame { height: 140px; }
        }
      </style>
      <div id="vw-header">
        <div>
          <div>Latest from Us</div>
          <span>Deepu Siva Pvt Ltd</span>
        </div>
        <div style="display:flex;gap:6px;">
          <button id="vw-toggle" title="Minimise" onclick="document.getElementById('vw-frame').style.display = document.getElementById('vw-frame').style.display==='none'?'block':'none';">—</button>
          <button id="vw-close" title="Close" onclick="document.getElementById('cmsVideoWidget').remove();">✕</button>
        </div>
      </div>
      <iframe id="vw-frame" src="${embedUrl}" allowfullscreen loading="lazy"></iframe>`;

    // Add after 3 seconds so page loads first
    setTimeout(() => document.body.appendChild(widget), 3000);
  } catch(e) {
    console.warn('CMS: Video widget load failed.', e.message);
  }
}

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  const igMatch = url.match(/instagram\.com\/reel\/([a-zA-Z0-9_-]+)/);
  if (igMatch) return `https://www.instagram.com/reel/${igMatch[1]}/embed/`;
  return null;
}

// ── 3. SOCIAL LINKS ─────────────────────────────────
// Updates footer social icon href attributes dynamically
// Social icons must have id="social-{platform}" e.g. id="social-instagram"
async function loadSocialLinks() {
  try {
    const snap  = await getDoc(doc(db, 'cms', 'settings'));
    if (!snap.exists()) return;

    const links = snap.data().socialLinks || {};
    const platforms = ['instagram','facebook','youtube','linkedin','twitter','whatsapp'];

    platforms.forEach(platform => {
      const el = document.getElementById('social-' + platform);
      if (el && links[platform]) {
        el.href   = links[platform];
        el.target = '_blank';
        el.rel    = 'noopener noreferrer';
      }
    });
  } catch(e) {
    console.warn('CMS: Social links load failed.', e.message);
  }
}

// ── BOOT ALL CMS LOADERS ────────────────────────────
loadPortfolio();
loadVideoWidget();
loadSocialLinks();

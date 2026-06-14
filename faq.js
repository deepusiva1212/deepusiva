// ════════════════════════════════════════════════
// faq.js - Edit your Questions and Answers here!
// ════════════════════════════════════════════════

const faqData = [
  {
    question: "Does the Government provide subsidies for installing Solar?",
    answer: "Yes! Under the central government's <strong>PM Surya Ghar: Muft Bijli Yojana</strong>, homeowners receive a direct cash subsidy directly into their bank accounts. Systems up to 2kW receive ₹30,000 per kW. For a 3kW system and above, you get a maximum flat subsidy of <strong>₹78,000</strong>. At Deepu Siva Pvt Ltd, we assist our clients with the entire documentation and DISCOM approval process."
  },
  {
    question: "What types of welding and metal fabrication do you handle?",
    answer: "We specialize in precision MS (Mild Steel) and SS (Stainless Steel) welding. This includes fabricating heavy-duty machinery platforms, conveyor supports, industrial sheds, and custom hot-dip galvanised mounting structures specifically engineered for heavy solar panels."
  },
  {
    question: "What materials do you use for Industrial Roofing?",
    answer: "We use premium, heavy-duty materials tailored to your industry. This includes high-grade GI (Galvanised Iron) corrugated sheets, colour-coated Galvalume sheets, standing seam profiles, and PUF insulated panels to maintain temperature control inside your factory."
  },
  {
    question: "Do you take projects outside Coimbatore?",
    answer: "Yes, while our fabrication workshop is headquartered in Coimbatore, our installation and erection teams execute major industrial, welding, and solar projects across all of Tamil Nadu, Kerala, and Karnataka."
  }
];

// This function automatically builds the FAQ on your website
function renderFAQ() {
  const container = document.getElementById('faq-container');
  if (!container) return;
  
  let html = '';
  faqData.forEach((item) => {
    html += `
      <div class="faq-item" style="background:var(--white); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; cursor:pointer; box-shadow:var(--shadow); margin-bottom:16px;" onclick="this.classList.toggle('active')">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-family:var(--font-head); font-size:18px; color:var(--text); text-transform:uppercase;">${item.question}</h4>
          <span class="faq-icon" style="color:var(--green); font-size:24px; font-weight:bold; transition:transform 0.3s ease;">+</span>
        </div>
        <div class="faq-answer" style="display:none; margin-top:12px; padding-top:12px; border-top:1px dashed var(--border); font-size:14px; color:var(--muted); line-height:1.6;">
          ${item.answer}
        </div>
      </div>
    `;
  });
  
  // Add the CSS required to make the accordion open and close
  html += `<style>.faq-item.active .faq-answer { display: block !important; } .faq-item.active .faq-icon { transform: rotate(45deg); }</style>`;
  
  container.innerHTML = html;
}

// Run the engine when the page loads
document.addEventListener('DOMContentLoaded', renderFAQ);

/**
 * House Price Prediction ML Studio - Main Application Controller
 */

(function () {
  'use strict';

  // Mobile menu toggle
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = 'var(--header-height)';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(8, 12, 20, 0.95)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border-subtle)';
      }
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // ScrollSpy for Header
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          current = sectionId;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // Code Copy Utility
  function initCopyButtons() {
    document.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const codeBlock = btn.closest('.code-tabs-wrap')?.querySelector('.code-block');
        if (!codeBlock) return;

        const text = codeBlock.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '✓ Copied!';
          btn.style.color = 'var(--accent-success)';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '';
          }, 2000);
        });
      });
    });
  }

  // Sample Verification Table Row Click Listeners
  function initSampleVerificationRows() {
    if (!window.MODEL_DATA || !window.MODEL_DATA.sample_predictions) return;
    const tbody = document.getElementById('sampleVerifyTableBody');
    if (!tbody) return;

    const samples = window.MODEL_DATA.sample_predictions.slice(0, 5);
    let html = '';

    samples.forEach((row, idx) => {
      html += `
        <tr>
          <td style="font-weight:700; color:var(--text-dim);">#${idx + 1} (ID: ${row.Id})</td>
          <td>${row.Area.toLocaleString()} sq ft</td>
          <td>${row.Bedrooms}b / ${row.Bathrooms}ba</td>
          <td>${row.Location}</td>
          <td>${row.Condition}</td>
          <td style="font-weight:700; color:#fff;">$${row.Price.toLocaleString()}</td>
          <td style="color:#818cf8; font-weight:700;">$${row.LR_Pred.toLocaleString()}</td>
          <td style="color:#34d399; font-weight:700;">$${row.DT_Pred.toLocaleString()}</td>
          <td style="text-align:right;">
            <button class="btn-load-sample" onclick="window.loadHouseIntoPredictor(${JSON.stringify(row).replace(/"/g, '&quot;')})">
              Load ➔
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollSpy();
    initCopyButtons();
    initSampleVerificationRows();
  });
})();

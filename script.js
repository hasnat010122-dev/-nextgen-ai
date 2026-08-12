/* Next Gen AI — interaction layer (dependency-free) */
(() => {
  'use strict';

  const MEDSTOCK_URL = 'https://medstock.nextaigen.org/';
  const samples = {
    augmentin: {
      medicine: 'Augmentin',
      strength: '625 mg',
      form: 'Film-coated tablet',
      pack: '14 tablets',
      batch: 'AU24K81',
      expiry: '08 / 2027',
      generic: 'amoxicillin + clavulanate',
      confidence: 96,
      colors: ['#f8f6eb', '#274e9f']
    },
    panadol: {
      medicine: 'Panadol Extra',
      strength: '500 mg + 65 mg',
      form: 'Tablet',
      pack: '20 tablets',
      batch: 'PX51A09',
      expiry: '11 / 2027',
      generic: 'paracetamol + caffeine',
      confidence: 94,
      colors: ['#eef7ef', '#157545']
    },
    lipitor: {
      medicine: 'Lipitor',
      strength: '20 mg',
      form: 'Film-coated tablet',
      pack: '30 tablets',
      batch: 'LT72P14',
      expiry: '03 / 2028',
      generic: 'atorvastatin calcium',
      confidence: 95,
      colors: ['#f0f4fa', '#244f9e']
    }
  };

  let selectedSample = 'augmentin';
  let uploadedFile = null;
  let extractedOutput = null;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function initNavigation() {
    const header = $('#siteHeader');
    const toggle = $('#menuToggle');
    const menu = $('#mobileNav');

    const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    toggle?.addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = $(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        menu?.classList.remove('open');
        toggle?.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(item => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    items.forEach(item => observer.observe(item));
  }

  function renderPack(sample) {
    const pack = $('#medicinePack');
    if (!pack || !sample) return;
    pack.style.background = sample.colors[0];
    pack.style.color = sample.colors[1];
    pack.style.backgroundImage = '';
    pack.innerHTML = `
      <div class="pack-brand">${sample.medicine}</div>
      <div class="pack-dose">${sample.strength}</div>
      <div class="pack-generic">${sample.generic}</div>
      <div class="pack-footer">${sample.pack}</div>`;
  }

  function setSelectedSample(key) {
    selectedSample = key;
    uploadedFile = null;
    $$('.sample-option').forEach(option => option.classList.toggle('active', option.dataset.sample === key));
    const uploadLabel = $('#uploadLabel');
    if (uploadLabel) uploadLabel.textContent = 'PNG or JPG · interaction preview only';
    renderPack(samples[key]);
    resetExtraction(false);
  }

  function initOcrLab() {
    const options = $$('.sample-option');
    const upload = $('#labelUpload');
    const zone = $('#uploadZone');
    const run = $('#runExtraction');
    const copy = $('#copyOutput');

    options.forEach(option => option.addEventListener('click', () => setSelectedSample(option.dataset.sample)));

    upload?.addEventListener('change', () => {
      const file = upload.files?.[0];
      if (!file) return;
      uploadedFile = file;
      $$('.sample-option').forEach(option => option.classList.remove('active'));
      const label = $('#uploadLabel');
      if (label) label.textContent = `${file.name} · ${(file.size / 1024).toFixed(0)} KB`;
      const pack = $('#medicinePack');
      if (pack) {
        const reader = new FileReader();
        reader.onload = event => {
          pack.innerHTML = '';
          pack.style.backgroundImage = `url(${event.target.result})`;
          pack.style.backgroundSize = 'cover';
          pack.style.backgroundPosition = 'center';
          pack.style.backgroundColor = '#e7e9e5';
        };
        reader.readAsDataURL(file);
      }
      resetExtraction(false);
    });

    ['dragenter', 'dragover'].forEach(type => zone?.addEventListener(type, event => {
      event.preventDefault();
      zone.classList.add('dragging');
    }));
    ['dragleave', 'drop'].forEach(type => zone?.addEventListener(type, event => {
      event.preventDefault();
      zone.classList.remove('dragging');
    }));
    zone?.addEventListener('drop', event => {
      const file = event.dataTransfer.files?.[0];
      if (!file || !file.type.startsWith('image/')) return showToast('Please choose a PNG or JPG image.');
      const transfer = new DataTransfer();
      transfer.items.add(file);
      upload.files = transfer.files;
      upload.dispatchEvent(new Event('change'));
    });

    run?.addEventListener('click', runExtraction);
    copy?.addEventListener('click', copyExtraction);
    renderPack(samples[selectedSample]);
  }

  function resetExtraction(clearUpload = true) {
    const status = $('#extractionStatus');
    const fields = $$('#resultFields > div strong');
    const progress = $('#extractionProgress');
    const confidence = $('#confidenceBar');
    const confidenceValue = $('#confidenceValue');
    const copy = $('#copyOutput');
    const preview = $('#scanPreview');
    if (status) status.textContent = 'Ready to extract';
    fields.forEach(field => field.textContent = '—');
    if (progress) progress.style.width = '0%';
    if (confidence) confidence.style.width = '0%';
    if (confidenceValue) confidenceValue.textContent = '—';
    if (copy) copy.disabled = true;
    preview?.classList.remove('scanning');
    extractedOutput = null;
    if (clearUpload) uploadedFile = null;
  }

  function runExtraction() {
    const button = $('#runExtraction');
    const preview = $('#scanPreview');
    const status = $('#extractionStatus');
    const progress = $('#extractionProgress');
    const placeholder = $('#scanPlaceholder');
    const copy = $('#copyOutput');
    if (!button || button.disabled) return;

    resetExtraction(false);
    button.disabled = true;
    button.querySelector('span').textContent = 'Extracting fields…';
    preview?.classList.add('scanning');
    if (placeholder) placeholder.textContent = 'Analyzing label regions';
    if (status) status.textContent = 'Reading visual information';

    const stages = [
      { delay: 250, width: 18, label: 'Detecting medicine label' },
      { delay: 700, width: 46, label: 'Locating printed fields' },
      { delay: 1200, width: 74, label: 'Structuring extracted data' },
      { delay: 1650, width: 92, label: 'Running validation checks' }
    ];
    stages.forEach(stage => setTimeout(() => {
      if (progress) progress.style.width = `${stage.width}%`;
      if (status) status.textContent = stage.label;
    }, stage.delay));

    setTimeout(() => {
      const source = uploadedFile ? {
        medicine: 'Uploaded label',
        strength: 'Review required',
        form: 'Not verified',
        pack: 'Not verified',
        batch: 'Review image',
        expiry: 'Review image',
        generic: 'uploaded medicine label',
        confidence: 72
      } : samples[selectedSample];

      extractedOutput = {
        medicine: source.medicine,
        strength: source.strength,
        dosage_form: source.form,
        pack_size: source.pack,
        batch_number: source.batch,
        expiry: source.expiry,
        confidence: `${source.confidence}%`,
        verification_required: true,
        demo_only: true
      };

      const values = [source.medicine, source.strength, source.form, source.pack, source.batch, source.expiry];
      $$('#resultFields > div strong').forEach((field, index) => field.textContent = values[index]);
      if (progress) progress.style.width = '100%';
      if ($('#confidenceBar')) $('#confidenceBar').style.width = `${source.confidence}%`;
      if ($('#confidenceValue')) $('#confidenceValue').textContent = `${source.confidence}%`;
      if (status) status.textContent = uploadedFile ? 'Preview generated — verify all fields' : 'Extraction preview complete';
      if (placeholder) placeholder.textContent = 'Human verification required';
      preview?.classList.remove('scanning');
      if (copy) copy.disabled = false;
      button.disabled = false;
      button.querySelector('span').textContent = 'Run extraction preview';
      showToast('Extraction preview complete. Verify every field.');
    }, 2200);
  }

  async function copyExtraction() {
    if (!extractedOutput) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(extractedOutput, null, 2));
      showToast('Preview JSON copied.');
    } catch {
      showToast('Copy is not available in this browser.');
    }
  }

  function initProjectFilters() {
    const buttons = $$('.project-filters button');
    const cards = $$('.portfolio-card[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';
        buttons.forEach(item => item.classList.toggle('active', item === button));
        cards.forEach(card => {
          const categories = (card.dataset.category || '').split(/\s+/);
          card.classList.toggle('filtered-out', filter !== 'all' && !categories.includes(filter));
        });
      });
    });
  }

  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const company = String(data.get('company') || '').trim();
      const message = String(data.get('message') || '').trim();
      if (!name || !email || !message) return showToast('Please complete the required fields.');

      const subject = encodeURIComponent(`AI project enquiry from ${name}${company ? ` — ${company}` : ''}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\n\nProject / workflow:\n${message}\n\nSent from nextaigen.org`);
      const status = $('#formStatus');
      if (status) status.textContent = 'Opening your email app…';
      window.location.href = `mailto:contact@nextaigen.org?subject=${subject}&body=${body}`;
      showToast('Your email enquiry is ready to send.');
    });
  }

  function ensureProductLinks() {
    $$(`a[href="${MEDSTOCK_URL}"]`).forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initReveal();
    initOcrLab();
    initProjectFilters();
    initContactForm();
    ensureProductLinks();
  });
})();

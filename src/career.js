import { $, saveLS, extractKeywords } from './utils.js';
import { JOB_DATABASE } from './data.js';

export function initCareer(state, renderSaved) {
  const fileDrop = $('#file-drop');
  const fileInput = $('#cv-file');
  const cvText = $('#cv-text');

  fileDrop.addEventListener('click', () => fileInput.click());

  fileDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDrop.style.borderColor = 'var(--accent)';
  });

  fileDrop.addEventListener('dragleave', () => {
    fileDrop.style.borderColor = '#e2e8f0';
  });

  fileDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDrop.style.borderColor = '#e2e8f0';
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.txt') || name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = () => {
        cvText.value = reader.result;
      };
      reader.readAsText(file);
    } else if (name.endsWith('.pdf')) {
      cvText.value = 'PDF loaded. If text not visible, please paste the CV text here for keyword extraction.';
      alert('PDF loaded. Paste text into the box for keyword extraction (or upload a .txt).');
    } else {
      alert('Please upload a .txt or .pdf file (or paste your CV text).');
    }
  }

  $('#btn-sample-cv').addEventListener('click', () => {
    const sample = `Liam O'Connor
Email: liam@example.com
Skills: JavaScript, React, HTML, CSS, customer service, event coordination, public speaking
Experience: Barista at Brewtown (2 years), Volunteer at Park Clean-up, internship marketing agency.`;
    cvText.value = sample;
    alert('Sample CV loaded — click Analyze CV.');
  });

  $('#analyze-btn').addEventListener('click', () => {
    const text = cvText.value.trim();
    if (!text) {
      alert('Please paste your CV text (or upload a .txt and try again).');
      return;
    }
    const keywords = extractKeywords(text);
    renderCareerResults(keywords, state, renderSaved);
  });

  $('#extract-keywords').addEventListener('click', () => {
    const keywords = extractKeywords(cvText.value);
    alert('Keywords found: ' + (keywords.length ? keywords.join(', ') : 'none found — try paste more detailed CV text'));
  });
}

function renderCareerResults(keywords, state, renderSaved) {
  const container = $('#career-results');
  container.innerHTML = '';
  const loc = $('#loc').value.trim();

  const header = document.createElement('div');
  header.className = 'muted';
  header.textContent = `Keywords: ${keywords.join(', ') || '—'}`;
  container.appendChild(header);

  const scored = JOB_DATABASE.map(job => {
    let score = 0;
    const jobTags = job.tags.join(' ');
    keywords.forEach(keyword => {
      if (job.title.toLowerCase().includes(keyword) || jobTags.includes(keyword)) {
        score += 2;
      }
    });
    if (loc && job.locations.some(l => l.toLowerCase().includes(loc.toLowerCase()))) {
      score += 3;
    }
    return { ...job, score };
  }).filter(job => job.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'item';
    noResults.textContent = 'No strong matches found. Try entering a nearby city/ZIP, or add more detail to your CV.';
    container.appendChild(noResults);

    const suggestion = JOB_DATABASE.slice(0, 4).map(j => `• ${j.title}`).join('\n');
    const popular = document.createElement('pre');
    popular.style.whiteSpace = 'pre-wrap';
    popular.style.marginTop = '8px';
    popular.textContent = 'Popular roles:\n' + suggestion;
    container.appendChild(popular);
    return;
  }

  scored.forEach(job => {
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;justify-content:space-between">
        <div>
          <div style="font-weight:600">${job.title}</div>
          <div class="muted" style="margin-top:6px">${job.tags.join(', ')} • Locations: ${job.locations.join(', ')}</div>
        </div>
        <div style="text-align:right">
          <div class="result-score">${job.score}</div>
          <button class="btn" style="margin-top:8px">Save</button>
        </div>
      </div>
    `;

    const btn = el.querySelector('button');
    btn.addEventListener('click', () => {
      state.saved.push({ type: 'job', value: job });
      saveLS('youthhub.saved', state.saved);
      renderSaved();
      alert('Saved to your quick list.');
    });

    container.appendChild(el);
  });
}

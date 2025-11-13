import { $, $all, saveLS, loadLS } from './utils.js';
import { initCareer } from './career.js';
import { initTravel, initMap } from './travel.js';
import { initCommunity } from './community.js';

const state = {
  saved: loadLS('youthhub.saved', []),
  community: loadLS('youthhub.community_custom', [])
};

function renderSaved() {
  const list = $('#saved-list');
  list.innerHTML = '';

  if (state.saved.length === 0) {
    list.innerHTML = '<div class="muted">No saved items yet</div>';
    return;
  }

  state.saved.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'item row';
    el.innerHTML = `
      <div>
        <div style="font-weight:600">${item.type === 'job' ? item.value.title : item.title}</div>
        <div class="muted">${item.type === 'job' ? (item.value.tags || []).join(', ') : item.desc || ''}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="ghost">Remove</button>
      </div>
    `;

    el.querySelector('button').addEventListener('click', () => {
      state.saved.splice(idx, 1);
      saveLS('youthhub.saved', state.saved);
      renderSaved();
    });

    list.appendChild(el);
  });
}

function initTabs() {
  const tabs = $all('button.tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.dataset.tab;
      $all('main section').forEach(section => section.classList.add('hidden'));
      $(`#${tabName}`).classList.remove('hidden');

      if (tabName === 'travel') {
        initMap();
      }
    });
  });
}

function initInterestChips() {
  const interestChips = $('#interest-chips');

  interestChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    chip.classList.toggle('on');
    chip.style.background = chip.classList.contains('on') ? '#dff3ff' : '#f3f6ff';
  });
}

function initClearButton() {
  $('#btn-clear').addEventListener('click', () => {
    if (!confirm('Clear saved items and custom community entries from local storage?')) {
      return;
    }

    localStorage.removeItem('youthhub.saved');
    localStorage.removeItem('youthhub.community_custom');
    state.saved = [];
    state.community = [];
    renderSaved();

    const communityResults = $('#community-results');
    communityResults.innerHTML = '<div class="item muted">Cleared. Click "Find opportunities" to refresh.</div>';

    alert('Cleared.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initInterestChips();
  initClearButton();
  renderSaved();

  initCareer(state, renderSaved);
  initTravel(state, renderSaved);
  initCommunity(state, renderSaved);
});

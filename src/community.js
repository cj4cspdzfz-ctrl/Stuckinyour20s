import { $, saveLS, loadLS } from './utils.js';
import { COMMUNITY_DB_SAMPLE } from './data.js';

export function initCommunity(state, renderSaved) {
  $('#find-community').addEventListener('click', () => {
    const interest = $('#community-interest').value;
    const loc = $('#loc').value.trim();
    const list = loadCommunityMixed(state).filter(opportunity => {
      const matchesTag = interest ? opportunity.tag === interest : true;
      const matchesLoc = loc ? (opportunity.location || '').toLowerCase().includes(loc.toLowerCase()) : true;
      return matchesTag && matchesLoc;
    });
    renderCommunity(list, state, renderSaved);
  });

  $('#add-opportunity').addEventListener('click', () => {
    $('#add-op-form').classList.remove('hidden');
  });

  $('#cancel-op').addEventListener('click', () => {
    $('#add-op-form').classList.add('hidden');
  });

  $('#save-op').addEventListener('click', () => {
    const title = $('#op-title').value.trim();
    const desc = $('#op-desc').value.trim();
    const tag = $('#op-tag').value.trim() || 'general';

    if (!title) {
      alert('Give a title');
      return;
    }

    const entry = {
      id: Date.now(),
      title,
      desc,
      tag,
      location: $('#loc').value.trim() || 'Nearby'
    };

    state.community.push(entry);
    saveLS('youthhub.community_custom', state.community);

    $('#add-op-form').classList.add('hidden');
    $('#op-title').value = '';
    $('#op-desc').value = '';
    $('#op-tag').value = '';

    alert('Saved custom opportunity. It is stored locally.');
  });

  renderCommunity(loadCommunityMixed(state), state, renderSaved);
}

function loadCommunityMixed(state) {
  return COMMUNITY_DB_SAMPLE.concat(state.community || []);
}

function renderCommunity(list, state, renderSaved) {
  const container = $('#community-results');
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = '<div class="item muted">No opportunities found. Try removing filters or add a custom opportunity below.</div>';
    return;
  }

  list.forEach(opportunity => {
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:600">${opportunity.title}</div>
          <div class="muted">${opportunity.tag || ''} • ${opportunity.location || 'Nearby'}</div>
          <div style="margin-top:6px" class="small">${opportunity.desc || ''}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <button class="btn">Join</button>
          <button class="ghost">Save</button>
        </div>
      </div>
    `;

    el.querySelector('.btn').addEventListener('click', () => {
      state.saved.push({ type: 'community', value: opportunity });
      saveLS('youthhub.saved', state.saved);
      renderSaved();
      alert('Marked interest. You can follow up externally.');
    });

    container.appendChild(el);
  });
}

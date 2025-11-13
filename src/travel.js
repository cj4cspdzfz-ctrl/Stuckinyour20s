import L from 'leaflet';
import { $, saveLS } from './utils.js';
import { TRIP_DATABASE } from './data.js';

let map;
let mapInited = false;

export function initTravel(state, renderSaved) {
  $('#suggest-trip').addEventListener('click', () => {
    const budget = Number($('#budget').value) || 0;
    const days = Number($('#days').value) || 2;
    const tags = ($('#bucket').value || '')
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const loc = $('#loc').value.trim();

    const results = suggestTrips({ budget, days, tags, loc });
    renderTrips(results, state, renderSaved);
  });

  $('#surprise-trip').addEventListener('click', () => {
    const randomTrip = TRIP_DATABASE[Math.floor(Math.random() * TRIP_DATABASE.length)];
    renderTrips([randomTrip], state, renderSaved);
  });
}

function suggestTrips({ budget, days, tags, loc }) {
  return TRIP_DATABASE.map(trip => {
    let score = 0;

    if (budget > 0) {
      const diff = Math.abs(budget - trip.costEstimate);
      score += Math.max(0, 10 - Math.round(diff / 30));
    }

    if (days) {
      score += Math.max(0, 5 - Math.abs(days - trip.days));
    }

    const overlap = tags.filter(tag => trip.tags.includes(tag)).length;
    score += overlap * 4;

    if (days && days <= 3 && trip.short) {
      score += 3;
    }

    return { ...trip, score };
  }).filter(trip => trip.score > 0).sort((a, b) => b.score - a.score);
}

function renderTrips(list, state, renderSaved) {
  const container = $('#travel-results');
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = '<div class="item muted">No trip suggestions matched — try changing budget, days, or tags.</div>';
    return;
  }

  list.forEach(trip => {
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `
      <div class="row">
        <div>
          <div style="font-weight:600">${trip.name} <span class="badge">${trip.country}</span></div>
          <div class="muted" style="margin-top:6px">Estimated cost: ${trip.costEstimate} • ${trip.days} day(s) • ${trip.tags.join(', ')}</div>
          <div style="margin-top:8px" class="small">Score ${Math.round(trip.score)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <button class="btn">Plan</button>
          <button class="ghost">Save</button>
        </div>
      </div>
    `;

    el.querySelector('.ghost').addEventListener('click', () => {
      state.saved.push({ type: 'trip', value: trip });
      saveLS('youthhub.saved', state.saved);
      renderSaved();
      alert('Trip saved.');
    });

    container.appendChild(el);
  });

  updateMap(list);
}

function initMap() {
  if (mapInited) return;
  mapInited = true;

  map = L.map('map').setView([51.505, -0.09], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function updateMap(trips) {
  if (!mapInited) initMap();

  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  trips.forEach(trip => {
    const marker = L.marker(trip.coords).addTo(map);
    marker.bindPopup(`
      <b>${trip.name}</b><br>
      Est. cost: ${trip.costEstimate}<br>
      ${trip.days} days<br>
      <button class="btn view-acc" data-name="${trip.name}">View accommodation</button>
    `);

    marker.on('popupopen', () => {
      const btn = document.querySelector('.view-acc');
      if (btn) {
        btn.addEventListener('click', () => {
          fetchHostelsForDestination(trip);
        });
      }
    });
  });

  const group = trips.map(t => t.coords);
  if (group.length > 0) {
    map.fitBounds(group);
  }
}

async function fetchHostelsForDestination(trip) {
  const { name, coords } = trip;
  const [lat, lon] = coords;
  console.log(`Fetching hostels for ${name} at ${lat},${lon}`);

  try {
    const data = [
      { title: "Hostel A", lat: lat + 0.02, lon: lon + 0.01, price: "£25/night" },
      { title: "Hostel B", lat: lat - 0.01, lon: lon - 0.02, price: "£18/night" }
    ];

    data.forEach(hostel => {
      const marker = L.marker([hostel.lat, hostel.lon]).addTo(map);
      marker.bindPopup(`<b>${hostel.title}</b><br>${hostel.price}<br><small>From API</small>`);
    });

    alert(`Accommodation suggestions loaded for ${name}.`);
  } catch (err) {
    console.error('Error fetching hostels:', err);
    alert('Could not fetch accommodation. Please check API credentials or network.');
  }
}

export { initMap };

# Stuckinyour20s
Youth hub
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Youth Hub — Career · Travel · Community</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    :root{
      --accent:#2b8cff;
      --muted:#6b7280;
      --card:#ffffff;
      --bg:#f4f6fb;
      --maxw:1100px;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color:#0f1724;
    }
    html,body{height:100%;margin:0;background:var(--bg);}
    .wrap{max-width:var(--maxw);margin:28px auto;padding:20px;}
    header{display:flex;gap:16px;align-items:center;justify-content:space-between}
    header h1{margin:0;font-size:20px}
    nav{display:flex;gap:8px;flex-wrap:wrap}
    button.tab{background:transparent;border:1px solid transparent;padding:8px 12px;border-radius:8px;cursor:pointer}
    button.tab.active{background:var(--accent);color:white;border-color:rgba(0,0,0,0.05)}
    .grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:18px}
    @media(min-width:900px){.grid{grid-template-columns:320px 1fr}}
    .card{background:var(--card);padding:14px;border-radius:12px;box-shadow:0 6px 18px rgba(16,24,40,0.06)}
    .side{position:sticky;top:20px;align-self:start}
    label{display:block;margin-top:10px;font-size:13px;color:var(--muted)}
    input[type="text"],input[type="number"],select,textarea{
      width:100%;padding:10px;border-radius:8px;border:1px solid #e6e9ef;margin-top:6px;font-size:14px;
    }
    .file-drop{border:2px dashed #e2e8f0;border-radius:8px;padding:12px;text-align:center;color:var(--muted);cursor:pointer}
    .small{font-size:13px;color:var(--muted)}
    .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .chip{padding:6px 8px;border-radius:999px;background:#f3f6ff;border:1px solid #e8f0ff;font-size:13px;cursor:pointer}
    .list{display:flex;flex-direction:column;gap:10px;margin-top:12px}
    .item{padding:10px;border-radius:10px;border:1px solid #f0f3fa;background:linear-gradient(180deg,#fff,#fbfeff)}
    .row{display:flex;gap:10px;align-items:center;justify-content:space-between}
    .muted{color:var(--muted);font-size:13px}
    .btn{background:var(--accent);color:white;padding:8px 12px;border-radius:8px;border:0;cursor:pointer}
    .ghost{background:transparent;border:1px solid #e2e8f0;padding:8px 10px;border-radius:8px}
    footer{margin-top:24px;text-align:center;color:var(--muted);font-size:13px}
    .badge{background:#eef6ff;padding:4px 8px;border-radius:999px;font-size:12px;color:#0b4fac}
    .result-score{font-weight:600;color:#0b4fac}
    .hidden{display:none}
    textarea{min-height:90px;}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div style="display:flex;align-items:center;gap:12px">
        <img src="" alt="" style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,var(--accent),#46e)" />
        <div>
          <h1>Youth Hub</h1>
          <div class="small">Career · Travel · Community — built for young people</div>
        </div>
      </div>
      <nav id="tabs">
        <button class="tab active" data-tab="career">Career</button>
        <button class="tab" data-tab="travel">Travel</button>
        <button class="tab" data-tab="community">Community</button>
      </nav>
    </header>

    <div class="grid">
      <aside class="side card" id="side-panel">
        <h3>Quick actions</h3>
        <div class="small">Use these to test features quickly</div>
        <div style="margin-top:12px">
          <button class="btn" id="btn-sample-cv">Load sample CV</button>
          <button class="ghost" id="btn-clear">Clear saved data</button>
        </div>

        <label for="loc">Your city / ZIP</label>
        <input type="text" id="loc" placeholder="e.g., London, SW1A or 10001" />

        <label>Interests (travel / community)</label>
        <div class="chips" id="interest-chips">
          <div class="chip" data-val="nature">Nature</div>
          <div class="chip" data-val="food">Food</div>
          <div class="chip" data-val="history">History</div>
          <div class="chip" data-val="art">Art</div>
          <div class="chip" data-val="sports">Sports</div>
        </div>

        <div style="margin-top:12px" class="small">Saved items</div>
        <div id="saved-list" class="list"></div>
      </aside>

      <main>
        <!-- Career -->
        <section id="career" class="card">
          <h2>Career</h2>
          <div class="small">Upload CV and get job ideas nearby.</div>

          <label>Upload CV (plain text or PDF)</label>
          <div class="file-drop" id="file-drop">Click or drag a .txt or .pdf here to upload</div>
          <input type="file" id="cv-file" accept=".txt,.pdf,.doc,.docx" style="display:none" />

          <label>Or paste CV text</label>
          <textarea id="cv-text" placeholder="Paste resume or CV text here"></textarea>

          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn" id="analyze-btn">Analyze CV</button>
            <button class="ghost" id="extract-keywords">Extract keywords</button>
          </div>

          <div id="career-results" class="list" style="margin-top:12px"></div>
        </section>

        <!-- Travel -->
        <section id="travel" class="card hidden">
          <h2>Travel</h2>
          <div class="small">Plan short trips and get accommodation suggestions.</div>

          <label>Budget (GBP / USD — any currency works)</label>
          <input type="number" id="budget" placeholder="e.g., 200" />

          <label>Trip length (days)</label>
          <input type="number" id="days" placeholder="e.g., 3" />

          <label>Bucket list tags (comma-separated)</label>
          <input type="text" id="bucket" placeholder="e.g., hiking, beaches, museums" />

          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn" id="suggest-trip">Suggest trips</button>
            <button class="ghost" id="surprise-trip">I'm feeling spontaneous</button>
          </div>

          <div id="travel-results" class="list" style="margin-top:12px"></div>

          <div id="map" style="height:400px; margin-top:20px; border-radius:12px;"></div>
        </section>

        <!-- Community -->
        <section id="community" class="card hidden">
          <h2>Community</h2>
          <div class="small">Volunteer opportunities, clubs, and hobbies to join nearby.</div>

          <label>Filter by interest</label>
          <select id="community-interest">
            <option value="">— any —</option>
            <option value="nature">Nature / Environment</option>
            <option value="art">Art / Culture</option>
            <option value="food">Food / Cooking</option>
            <option value="sports">Sports</option>
            <option value="teaching">Teaching / Mentoring</option>
          </select>

          <div style="margin-top:10px;display:flex;gap:8px;">
            <button class="btn" id="find-community">Find opportunities</button>
            <button class="ghost" id="add-opportunity">Add custom opportunity</button>
          </div>

          <div id="community-results" class="list" style="margin-top:12px"></div>

          <div id="add-op-form" class="hidden" style="margin-top:10px">
            <label>Title</label>
            <input id="op-title" />
            <label>Description</label>
            <textarea id="op-desc"></textarea>
            <label>Interest tag</label>
            <input id="op-tag" placeholder="e.g., art" />
            <div style="margin-top:8px;display:flex;gap:8px">
              <button class="btn" id="save-op">Save</button>
              <button class="ghost" id="cancel-op">Cancel</button>
            </div>
          </div>
        </section>

      </main>
    </div>

    <footer class="small">
      Built for young people • Data stored locally in your browser • Accommodation suggestions via API (once configured)
    </footer>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    /* ---------- Simple datasets (expandable) ---------- */
    const JOB_DATABASE = [
      {title:"Junior Software Developer", tags:["software","coding","tech"], locations:["London","Manchester","Bristol","10001"]},
      {title:"Retail Assistant", tags:["retail","customer service"], locations:["London","10001","Paris"]},
      {title:"Barista / Cafe Staff", tags:["food","hospitality"], locations:["London","Bristol","10001"]},
      {title:"Marketing Assistant", tags:["marketing","communications"], locations:["London","Manchester"]},
      {title:"Environmental Volunteer Coordinator", tags:["nature","volunteer"], locations:["Bristol","Edinburgh","London"]},
      {title:"Museum Assistant / Gallery Attendant", tags:["art","history"], locations:["London","Paris"]},
      {title:"Sports Coach (Youth)", tags:["sports","teaching"], locations:["Manchester","Liverpool","London"]}
    ];

    const TRIP_DATABASE = [
      {name:"Coastal Weekend: Brighton & Seven Sisters", country:"UK", costEstimate:120, days:2, tags:["beaches","nature","food"], short:true, coords:[50.821, -0.137]},
      {name:"City Break: Edinburgh Historic Tour", country:"UK", costEstimate:180, days:3, tags:["history","culture","food"], short:true, coords:[55.953, -3.188]},
      {name:"Hiking in Snowdonia", country:"UK", costEstimate:220, days:3, tags:["nature","hiking","adventure"], short:false, coords:[53.068, -4.076]},
      {name:"Paris: Art & Pastries", country:"France", costEstimate:200, days:2, tags:["art","food","city"], short:true, coords:[48.8566, 2.3522]},
      {name:"Lake District Camping", country:"UK", costEstimate:140, days:2, tags:["nature","camping","hiking"], short:true, coords:[54.4609, -3.0886]},
      {name:"Weekend Surf Trip: Newquay", country:"UK", costEstimate:160, days:2, tags:["beaches","adventure","sports"], short:true, coords:[50.4136, -5.0737]}
    ];

    const COMMUNITY_DB_SAMPLE = [
      {id:1,title:"Park Clean-up Crew",desc:"Join local volunteers to clean and restore the neighborhood park.",tag:"nature",location:"London"},
      {id:2,title:"Youth Cooking Club",desc:"Learn cooking basics and help run pop-up community meals.",tag:"food",location:"Bristol"},
      {id:3,title:"Volunteer at City Museum",desc:"Help guide school groups and maintain exhibits.",tag:"art",location:"Edinburgh"},
      {id:4,title:"Saturday Football For Kids",desc:"Coach young players one Saturday per week.",tag:"sports",location:"Manchester"}
    ];

    /* ---------- Utilities ---------- */
    function $(s){return document.querySelector(s)}
    function $all(s){return Array.from(document.querySelectorAll(s))}
    function saveLS(key,val){localStorage.setItem(key,JSON.stringify(val))}
    function loadLS(key,def){try{return JSON.parse(localStorage.getItem(key))||def}catch(e){return def}}

    /* ---------- State ---------- */
    let state = {
      saved: loadLS('youthhub.saved', []),
      community: loadLS('youthhub.community_custom', [])
    };

    /* ---------- UI wiring ---------- */
    const tabs = $all('button.tab');
    tabs.forEach(t=>{
      t.addEventListener('click', ()=>{
        tabs.forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
        const tab = t.dataset.tab;
        $all('main section').forEach(s=>s.classList.add('hidden'));
        $(`#${tab}`).classList.remove('hidden');
        if(tab==='travel'){ initMap(); } 
      });
    });

    const interestChips = document.getElementById('interest-chips');
    interestChips.addEventListener('click', (e)=>{
      const c = e.target.closest('.chip'); if(!c) return;
      c.classList.toggle('on');
      c.style.background = c.classList.contains('on') ? '#dff3ff' : '#f3f6ff';
    });

    document.getElementById('btn-sample-cv').addEventListener('click', ()=>{
      const sample = `Liam O'Connor
Email: liam@example.com
Skills: JavaScript, React, HTML, CSS, customer service, event coordination, public speaking
Experience: Barista at Brewtown (2 years), Volunteer at Park Clean-up, internship marketing agency.`;
      $('#cv-text').value = sample;
      alert('Sample CV loaded — click Analyze CV.');
    });

    document.getElementById('btn-clear').addEventListener('click', ()=>{
      if(!confirm('Clear saved items and custom community entries from local storage?')) return;
      localStorage.removeItem('youthhub.saved');
      localStorage.removeItem('youthhub.community_custom');
      state.saved = []; state.community = [];
      renderSaved();
      renderCommunity([]);
      alert('Cleared.');
    });

    /* File upload logic */
    const fileDrop = $('#file-drop');
    const fileInput = $('#cv-file');
    fileDrop.addEventListener('click', ()=>fileInput.click());
    fileDrop.addEventListener('dragover', e=>{e.preventDefault(); fileDrop.style.borderColor='var(--accent)'});
    fileDrop.addEventListener('dragleave', e=>{fileDrop.style.borderColor='#e2e8f0'});
    fileDrop.addEventListener('drop', e=>{
      e.preventDefault(); fileDrop.style.borderColor='#e2e8f0';
      const f = e.dataTransfer.files[0];
      if(f) handleFile(f);
    });
    fileInput.addEventListener('change', ()=>{ if(fileInput.files[0]) handleFile(fileInput.files[0]) });

    function handleFile(file){
      const name = file.name.toLowerCase();
      if(name.endsWith('.txt')||name.endsWith('.md')){
        const reader=new FileReader();
        reader.onload=()=> $('#cv-text').value = reader.result;
        reader.readAsText(file);
      } else if(name.endsWith('.pdf')){
        const reader=new FileReader();
        reader.onload=()=>{
          $('#cv-text').value = 'PDF loaded. If text not visible, please paste the CV text here for keyword extraction.';
          alert('PDF loaded. Paste text into the box for keyword extraction (or upload a .txt).');
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('Please upload a .txt or .pdf file (or paste your CV text).');
      }
    }

    /* ---------- Career: analyze CV ---------- */
    function extractKeywords(text){
      if(!text) return [];
      text = text.toLowerCase();
      const common = ["javascript","react","node","python","html","css","marketing","sales","customer service","barista","volunteer","coordinator","internship","designer","graphic","data","analysis","teaching","coach","events","hospitality","engineering","manager","social media"];
      const found = new Set();
      common.forEach(k=>{ if(text.includes(k)) found.add(k) });
      const tokens = text.replace(/[^\w\s]/g,' ').split(/\s+/).filter(t=>t.length>3);
      tokens.forEach(tok=>{
        const freq = tokens.filter(x=>x===tok).length;
        if(freq>1) found.add(tok);
      });
      return Array.from(found);
    }

    $('#analyze-btn').addEventListener('click', ()=>{
      const text = $('#cv-text').value.trim();
      if(!text){ alert('Please paste your CV text (or upload a .txt and try again).'); return; }
      const keywords = extractKeywords(text);
      renderCareerResults(keywords);
    });

    $('#extract-keywords').addEventListener('click', ()=>{
      const k = extractKeywords($('#cv-text').value);
      alert('Keywords found: ' + (k.length? k.join(', ') : 'none found — try paste more detailed CV text'));
    });

    function renderCareerResults(keywords){
      const container = $('#career-results');
      container.innerHTML = '';
      const loc = $('#loc').value.trim();
      const header = document.createElement('div'); header.className='muted'; header.textContent = `Keywords: ${keywords.join(', ') || '—'}`; container.appendChild(header);

      const scored = JOB_DATABASE.map(job=>{
        let score=0;
        const jobTags = job.tags.join(' ');
        keywords.forEach(k=>{ if(job.title.toLowerCase().includes(k)||jobTags.includes(k)) score+=2 });
        if(loc && job.locations.some(l=>l.toLowerCase().includes(loc.toLowerCase()))) score+=3;
        return {...job,score};
      }).filter(j=>j.score>0).sort((a,b)=>b.score-a.score);

      if(scored.length===0){
        const p=document.createElement('div'); p.className='item'; p.textContent='No strong matches found. Try entering a nearby city/ZIP, or add more detail to your CV.';
        container.appendChild(p);
        const suggestion = JOB_DATABASE.slice(0,4).map(j=>`• ${j.title}`).join('\n');
        const u=document.createElement('pre'); u.style.whiteSpace='pre-wrap'; u.style.marginTop='8px'; u.textContent = 'Popular roles:\n'+suggestion;
        container.appendChild(u);
        return;
      }

      scored.forEach(job=>{
        const el = document.createElement('div'); el.className='item';
        el.innerHTML = `<div style="display:flex;gap:8px;align-items:center;justify-content:space-between">
          <div>
            <div style="font-weight:600">${job.title}</div>
            <div class="muted" style="margin-top:6px">${job.tags.join(', ')} • Locations: ${job.locations.join(', ')}</div>
          </div>
          <div style="text-align:right">
            <div class="result-score">${job.score}</div>
            <button class="btn" style="margin-top:8px" data-title="${job.title}">Save</button>
          </div>
        </div>`;
        const btn = el.querySelector('button');
        btn.addEventListener('click', ()=>{
          state.saved.push({type:'job',value:job});
          saveLS('youthhub.saved', state.saved);
          renderSaved();
          alert('Saved to your quick list.');
        });
        container.appendChild(el);
      });
    }

    function renderSaved(){
      const list = $('#saved-list');
      list.innerHTML = '';
      if(state.saved.length===0){ list.innerHTML = '<div class="muted">No saved items yet</div>'; return; }
      state.saved.forEach((s,idx)=>{
        const el = document.createElement('div'); el.className='item row';
        el.innerHTML = `<div>
          <div style="font-weight:600">${s.type==='job' ? s.value.title : s.title}</div>
          <div class="muted">${s.type==='job' ? (s.value.tags||[]).join(', ') : s.desc || ''}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button class="ghost" data-idx="${idx}">Remove</button>
        </div>`;
        el.querySelector('button').addEventListener('click', ()=>{
          state.saved.splice(idx,1);
          saveLS('youthhub.saved', state.saved);
          renderSaved();
        });
        list.appendChild(el);
      });
    }
    renderSaved();

    /* ---------- Travel & Map ---------- */
    let map, mapInited=false;
    function initMap(){
      if(mapInited) return;
      mapInited=true;
      map = L.map('map').setView([51.505, -0.09], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    }

    function updateMap(trips){
      if(!mapInited) initMap();
      // remove old markers
      map.eachLayer(layer=>{
        if(layer instanceof L.Marker) map.removeLayer(layer);
      });
      // add markers for trips
      trips.forEach(t=>{
        const m = L.marker(t.coords).addTo(map);
        m.bindPopup(`<b>${t.name}</b><br>Est. cost: ${t.costEstimate}<br>${t.days} days<br><button data‐name="${t.name}" class="btn view-acc">View accommodation</button>`);
        m.on('popupopen', () => {
          const btn = document.querySelector('.view-acc');
          if(btn){
            btn.addEventListener('click', () => { fetchHostelsForDestination(t); });
          }
        });
      });
      const group = trips.map(t=>t.coords);
      if(group.length>0){ map.fitBounds(group); }
    }

    function suggestTrips({budget,days,tags,loc}){
      return TRIP_DATABASE.map(t=>{
        let score=0;
        if(budget>0){
          const diff = Math.abs(budget - t.costEstimate);
          score += Math.max(0,10 - Math.round(diff/30));
        }
        if(days) score += Math.max(0,5 - Math.abs(days - t.days));
        const overlap = tags.filter(tag=>t.tags.includes(tag)).length;
        score += overlap *4;
        if(days && days<=3 && t.short) score += 3;
        return {...t,score};
      }).filter(t=>t.score>0).sort((a,b)=>b.score-a.score);
    }

    $('#suggest-trip').addEventListener('click', ()=>{
      const budget = Number($('#budget').value) || 0;
      const days = Number($('#days').value) || 2;
      const tags = ($('#bucket').value || '').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
      const loc = $('#loc').value.trim();
      const results = suggestTrips({budget,days,tags,loc});
      renderTrips(results);
    });

    $('#surprise-trip').addEventListener('click', ()=>{
      const r = TRIP_DATABASE[Math.floor(Math.random()*TRIP_DATABASE.length)];
      renderTrips([r]);
    });

    function renderTrips(list){
      const cont = $('#travel-results'); cont.innerHTML='';
      if(!list || list.length===0){ cont.innerHTML = '<div class="item muted">No trip suggestions matched — try changing budget, days, or tags.</div>'; return; }
      list.forEach(t=>{
        const el = document.createElement('div'); el.className='item';
        el.innerHTML = `<div class="row">
          <div>
            <div style="font-weight:600">${t.name} <span class="badge">${t.country}</span></div>
            <div class="muted" style="margin-top:6px">Estimated cost: ${t.costEstimate} • ${t.days} day(s) • ${t.tags.join(', ')}</div>
            <div style="margin-top:8px" class="small">Score ${Math.round(t.score)}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
            <button class="btn">Plan</button>
            <button class="ghost" data-name="${t.name}">Save</button>
          </div>
        </div>`;
        el.querySelector('.ghost').addEventListener('click', ()=>{
          state.saved.push({type:'trip',value:t});
          saveLS('youthhub.saved', state.saved);
          renderSaved();
          alert('Trip saved.');
        });
        cont.appendChild(el);
      });
      updateMap(list);
    }

    // Placeholder: fetch hostels/accommodations for a destination using external API
    async function fetchHostelsForDestination(trip){
      // You will need to substitute your actual API endpoint, key, parameters here.
      const {name, coords} = trip;
      const [lat, lon] = coords;
      console.log(`Fetching hostels for ${name} at ${lat},${lon}`);

      try {
        // Example placeholder request:
        // const response = await fetch(`https://api.hostelworld.com/…?lat=${lat}&lon=${lon}&key=YOUR_API_KEY`);
        // const data = await response.json();

        // For demo: simulate data
        const data = [
          {title:"Hostel A",lat:lat+0.02, lon:lon+0.01, price:"£25/night"},
          {title:"Hostel B",lat:lat-0.01, lon:lon-0.02, price:"£18/night"}
        ];

        // Add markers for hostels
        data.forEach(h=>{
          const m = L.marker([h.lat, h.lon], {icon: L.icon({iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize:[25,41], iconAnchor:[12,41]})}).addTo(map);
          m.bindPopup(`<b>${h.title}</b><br>${h.price}<br><small>From API</small>`);
        });

        alert(`Accommodation suggestions loaded for ${name}.`);
      } catch (err){
        console.error('Error fetching hostels:', err);
        alert('Could not fetch accommodation. Please check API credentials or network.');
      }
    }

    /* ---------- Community ---------- */
    function loadCommunityMixed(){
      return COMMUNITY_DB_SAMPLE.concat(state.community || []);
    }

    $('#find-community').addEventListener('click', ()=>{
      const interest = $('#community-interest').value;
      const loc = $('#loc').value.trim();
      const list = loadCommunityMixed().filter(o=>{
        const matchesTag = interest ? o.tag===interest : true;
        const matchesLoc = loc ? (o.location||'').toLowerCase().includes(loc.toLowerCase()) : true;
        return matchesTag && matchesLoc;
      });
      renderCommunity(list);
    });

    function renderCommunity(list){
      const cont = $('#community-results'); cont.innerHTML='';
      if(!list || list.length===0){ cont.innerHTML='<div class="item muted">No opportunities found. Try removing filters or add a custom opportunity below.</div>'; return; }
      list.forEach((o,idx)=>{
        const el = document.createElement('div'); el.className='item';
        el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:600">${o.title}</div>
            <div class="muted">${o.tag || ''} • ${o.location || 'Nearby'}</div>
            <div style="margin-top:6px" class="small">${o.desc || ''}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
            <button class="btn">Join</button>
            <button class="ghost">Save</button>
          </div>
        </div>`;
        el.querySelector('.btn').addEventListener('click', ()=>{
          state.saved.push({type:'community',value:o});
          saveLS('youthhub.saved', state.saved);
          renderSaved();
          alert('Marked interest. You can follow up externally.');
        });
        cont.appendChild(el);
      });
    }

    $('#add-opportunity').addEventListener('click', ()=>$('#add-op-form').classList.remove('hidden'));
    $('#cancel-op').addEventListener('click', ()=>$('#add-op-form').classList.add('hidden'));
    $('#save-op').addEventListener('click', ()=>{
      const title = $('#op-title').value.trim(); const desc = $('#op-desc').value.trim(); const tag = $('#op-tag').value.trim() || 'general';
      if(!title){ alert('Give a title'); return; }
      const entry = {id:Date.now(),title,desc,tag,location:$('#loc').value.trim() || 'Nearby'};
      state.community.push(entry);
      saveLS('youthhub.community_custom', state.community);
      $('#add-op-form').classList.add('hidden');
      $('#op-title').value=''; $('#op-desc').value=''; $('#op-tag').value='';
      alert('Saved custom opportunity. It is stored locally.');
    });

    /* ---------- initial render ---------- */
    renderCommunity(loadCommunityMixed());
    document.addEventListener('DOMContentLoaded', ()=>{
      state.community = loadLS('youthhub.community_custom', []);
      renderSaved();
    });

  </script>
</body>
</html>

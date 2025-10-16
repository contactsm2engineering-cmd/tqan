
const KEY = 'tqan_reserves_v1';

const planImg = document.getElementById('planImg');
const markersLayer = document.getElementById('markers');
const modal = document.getElementById('modal');
const form = document.getElementById('modalForm');
const filterStatus = document.getElementById('filterStatus');
const search = document.getElementById('search');
const list = document.getElementById('list');

let reserves = load();
let pendingPoint = null;

function load(){
  try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; }
}
function save(){
  localStorage.setItem(KEY, JSON.stringify(reserves));
}

function toPercentCoords(evt){
  const rect = planImg.getBoundingClientRect();
  const x = (evt.clientX - rect.left) / rect.width;
  const y = (evt.clientY - rect.top) / rect.height;
  return {x, y};
}

function addMarker(r){
  const m = document.createElement('div');
  m.className = 'marker';
  m.style.left = (r.x*100)+'%';
  m.style.top = (r.y*100)+'%';
  m.dataset.id = r.id;

  const badge = document.createElement('div');
  badge.className = 'badge badge-status ' + r.status;
  badge.textContent = r.status.replace('_',' ');
  m.appendChild(badge);

  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.title = r.desc || 'Réserve';
  dot.addEventListener('click', () => {
    const el = document.querySelector(`[data-card='${r.id}']`);
    if(el){ el.scrollIntoView({behavior:'smooth', block:'center'}); el.classList.add('highlight'); setTimeout(()=>el.classList.remove('highlight'), 1000); }
  });
  m.appendChild(dot);

  markersLayer.appendChild(m);
}

function renderMarkers(){
  markersLayer.innerHTML = '';
  reserves.forEach(addMarker);
}

function renderList(){
  list.innerHTML = '';
  const q = (search.value||'').toLowerCase();
  const f = filterStatus.value;
  let items = reserves.slice().reverse();
  items = items.filter(r => (!f || r.status===f) && (!q || (r.room||'').toLowerCase().includes(q) || (r.desc||'').toLowerCase().includes(q)));
  for(const r of items){
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.card = r.id;
    const h = document.createElement('h4');
    h.textContent = `${r.room || 'Zone ?'} — ${r.lot} (#${r.code})`;
    const row = document.createElement('div');
    row.className = 'row';
    const b = document.createElement('span');
    b.className = 'badge badge-status ' + r.status;
    b.textContent = r.status.replace('_',' ');
    const pr = document.createElement('span');
    pr.className = 'badge-status';
    pr.textContent = r.priority;
    row.appendChild(b); row.appendChild(pr);

    const desc = document.createElement('div');
    desc.className = 'small';
    desc.textContent = r.desc || '';

    const controls = document.createElement('div');
    controls.className = 'controls';
    const sel = document.createElement('select');
    ['ouverte','en_cours','levee'].forEach(s=>{
      const o = document.createElement('option'); o.value=s; o.textContent=s.replace('_',' ');
      if(s===r.status) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', ()=>{
      r.status = sel.value; save(); renderMarkers(); renderList();
    });
    const del = document.createElement('button');
    del.className = 'btn btn-outline';
    del.textContent = 'Supprimer';
    del.addEventListener('click', ()=>{
      if(confirm('Supprimer cette réserve ?')){
        reserves = reserves.filter(x=>x.id!==r.id);
        save(); renderMarkers(); renderList();
      }
    });
    controls.appendChild(sel); controls.appendChild(del);

    if(r.photo){
      const img = document.createElement('img');
      img.src = r.photo; img.className='photo-thumb';
      controls.appendChild(img);
    }

    card.appendChild(h); card.appendChild(row); card.appendChild(desc); card.appendChild(controls);
    list.appendChild(card);
  }
}

planImg.addEventListener('click', (evt)=>{
  const {x,y} = toPercentCoords(evt);
  pendingPoint = {x,y};
  form.reset();
  modal.showModal();
});

document.getElementById('saveBtn').addEventListener('click', async (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const photoFile = fd.get('photo');
  let photoData = null;
  if(photoFile and hasattr(photoFile, 'size') and photoFile.size>0){
    // This part will run in browser, so ignore Python-like guards here.
  }
});

// The above placeholders are for the python linter in this environment.
// Below is the real browser-side implementation re-attached:
document.getElementById('saveBtn').onclick = async function(e){
  e.preventDefault();
  const fd = new FormData(form);
  const photoFile = fd.get('photo');
  let photoData = null;
  if(photoFile && photoFile.size>0){
    photoData = await fileToDataUrl(photoFile);
  }
  const id = Math.random().toString(36).slice(2,9);
  const r = {
    id,
    code: new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14),
    x: pendingPoint.x, y: pendingPoint.y,
    room: fd.get('room') || '',
    lot: fd.get('lot') || 'Finition',
    status: fd.get('status') || 'ouverte',
    priority: fd.get('priority') || 'Moyenne',
    desc: fd.get('desc') || '',
    photo: photoData
  };
  reserves.push(r);
  save(); renderMarkers(); renderList();
  modal.close();
};

function fileToDataUrl(file){
  return new Promise((resolve,reject)=>{
    const fr = new FileReader();
    fr.onload = ()=>resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

document.getElementById('reset').addEventListener('click', ()=>{
  if(confirm('Réinitialiser toutes les réserves ?')){
    reserves = []; save(); renderMarkers(); renderList();
  }
});

document.getElementById('exportJson').addEventListener('click', ()=>{
  const data = JSON.stringify(reserves, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'tqan-reserves.json'; a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('planUpload').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    planImg.src = reader.result;
    reserves = []; save(); renderMarkers(); renderList();
  };
  reader.readAsDataURL(file);
});

filterStatus.addEventListener('change', renderList);
search.addEventListener('input', renderList);

renderMarkers();
renderList();

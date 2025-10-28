const API_BASE = ""; // same-origin
const WA_NUMBER = "+447960030047";
const $ = (s)=>document.querySelector(s);
const num = (v,d=0)=>{if(v===undefined||v===null||v==='')return d; if(typeof v==='number')return v; const n=parseFloat(String(v).replace(/[^0-9.\-]/g,'')); return isNaN(n)?d:n;};
const moneyGBP = (n)=>'£'+num(n,0).toLocaleString();
const authHeaders = ()=>({ 'Content-Type':'application/json', ...(localStorage.getItem('token')?{Authorization:'Bearer '+localStorage.getItem('token')}:{}) });

document.addEventListener('click', e => { if (e.target.classList.contains('menu-btn')) document.querySelector('.menu')?.classList.toggle('active'); });

const api = {
  getCars: async ()=> (await fetch(`${API_BASE}/api/cars`)).json(),
  getCar: async (id)=> (await fetch(`${API_BASE}/api/cars/${id}`)).json(),
  addCar: async (car)=> (await fetch(`${API_BASE}/api/cars`, {method:'POST', headers:authHeaders(), body:JSON.stringify(car)})).json(),
  updateCar: async (id, car)=> (await fetch(`${API_BASE}/api/cars/${id}`, {method:'PUT', headers:authHeaders(), body:JSON.stringify(car)})).json(),
  deleteCar: async (id)=> (await fetch(`${API_BASE}/api/cars/${id}`, {method:'DELETE', headers:authHeaders()})).json(),
  sellList: async ()=> (await fetch(`${API_BASE}/api/sellcars`, { headers: authHeaders() })).json(),
  sellCreate: async (row)=> (await fetch(`${API_BASE}/api/sellcars`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(row)})).json(),
  sellUpdate: async (id, row)=> (await fetch(`${API_BASE}/api/sellcars/${id}`, {method:'PUT', headers:authHeaders(), body:JSON.stringify(row)})).json(),
  sellDelete: async (id)=> (await fetch(`${API_BASE}/api/sellcars/${id}`, {method:'DELETE', headers:authHeaders()})).json(),
  feedbackList: async ()=> (await fetch(`${API_BASE}/api/feedback`)).json(),
  feedbackCreate: async (row)=> (await fetch(`${API_BASE}/api/feedback`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(row)})).json(),
  feedbackDelete: async (id)=> (await fetch(`${API_BASE}/api/feedback/${id}`, {method:'DELETE', headers:authHeaders()})).json(),
  login: async (email,password)=> (await fetch(`${API_BASE}/api/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password})})).json(),
};

function renderCarCard(c){
  const name = c.name || `${c.make||''} ${c.model||''}`.trim();
  const img = (c.images && c.images[0]) || 'images/car-placeholder.jpg';
  const msg = `Hi, I am interested in ${name}${c.year?` (${c.year})`:''} listed on Britzcar.`;
  const wa = `https://wa.me/${WA_NUMBER.replace(/\s+/g,'')}/?text=${encodeURIComponent(msg)}`;
  return `
    <div class="car-card" data-id="${c._id}">
      <div class="image-container" onclick="goDetails('${c._id}')"><img src="${img}" alt="${name}"></div>
      <div class="info">
        <h3>${name}</h3>
        <p>${[c.make,c.model].filter(Boolean).join(' ')}${c.year?` • ${c.year}`:''}</p>
        <p><strong>${moneyGBP(c.price)}</strong>${c.mileage?` • ${num(c.mileage).toLocaleString()} km`:''}</p>
        <a href="${wa}" target="_blank" class="btn-whatsapp"><img src="images/whatsapp.png" alt=""> Chat on WhatsApp</a>
      </div>
    </div>`;
}
function goDetails(id){ localStorage.setItem('selectedCarId', id); location.href='car-details.html'; }

function applyFiltersSort(cars){
  const q = (document.getElementById('q')?.value||'').toLowerCase().trim();
  const maxPrice = document.getElementById('maxPrice')?.value ? num(document.getElementById('maxPrice').value, Infinity) : Infinity;
  const minYear = document.getElementById('minYear')?.value ? num(document.getElementById('minYear').value, 0) : 0;
  const sortVal = document.getElementById('sortCars')?.value || 'priceHigh';
  let list = cars.filter(c => {
    const hay = `${c.name||''} ${c.make||''} ${c.model||''} ${c.details||''}`.toLowerCase();
    return (hay.includes(q) || !q) && num(c.price, Infinity) <= maxPrice && num(c.year, 0) >= minYear;
  });
  const gp = x => num(x.price, 0), gy = x => num(x.year, 0);
  if (sortVal === 'priceHigh') list.sort((a,b)=> gp(b)-gp(a));
  if (sortVal === 'priceLow')  list.sort((a,b)=> gp(a)-gp(b));
  if (sortVal === 'yearNew')   list.sort((a,b)=> gy(b)-gy(a));
  if (sortVal === 'yearOld')   list.sort((a,b)=> gy(a)-gy(b));
  return list;
}

window.CarsPage = {
  cars: [],
  async init(){
    this.cars = await api.getCars();
    const render = ()=>{ document.getElementById('carList').innerHTML = applyFiltersSort(this.cars).map(renderCarCard).join(''); };
    ['q','maxPrice','minYear','sortCars'].forEach(id=>{ const el=document.getElementById(id); if(el){ el.addEventListener('input',render); el.addEventListener('change',render);} });
    render();
  }
};

window.DetailsPage = {
  async init(){
    const id = localStorage.getItem('selectedCarId');
    if(!id) return;
    const car = await api.getCar(id);
    const imgs = (car.images && car.images.length) ? car.images : ['images/car-placeholder.jpg'];
    const hero = document.getElementById('heroImg'); if (hero) hero.src = imgs[0];
    const thumbs = document.getElementById('thumbs');
    if (thumbs){
      thumbs.innerHTML = imgs.map((src,i)=> `<img src="${src}" class="${i===0?'active':''}" onclick="(function(){document.getElementById('heroImg').src='${src}'; Array.from(document.querySelectorAll('#thumbs img')).forEach(n=>n.classList.remove('active')); this.classList.add('active');}).call(this)">`).join('');
    }
    document.getElementById('carTitle').textContent = car.name || `${car.make||''} ${car.model||''}`.trim();
    document.getElementById('titleText').textContent = car.name || `${car.make||''} ${car.model||''}`.trim();
    document.getElementById('priceText').textContent = moneyGBP(car.price);
    document.getElementById('specs').innerHTML = [
      ['Make', car.make], ['Model', car.model], ['Year', car.year],
      ['Mileage', car.mileage? `${num(car.mileage).toLocaleString()} km`:'—'],
      ['Fuel', car.fuel||'—'], ['Transmission', car.transmission||'—'],
      ['Engine', car.engine||'—'], ['Color', car.color||'—'],
    ].map(([k,v])=> `<div><strong>${k}</strong><div>${v||'—'}</div></div>`).join('');
    document.getElementById('description').textContent = car.details || 'No description provided.';
    const msg = `Hi, I am interested in ${car.name||car.model||'a car'}${car.year?` (${car.year})`:''} listed on Britzcar.`;
    document.getElementById('detailsWA').href = `https://wa.me/${WA_NUMBER.replace(/\s+/g,'')}/?text=${encodeURIComponent(msg)}`;
  }
};

window.SellPage = {
  async init(){
    const list = document.getElementById('submittedList');
    const token = localStorage.getItem('token');
    if (token){
      try{
        const rows = await api.sellList();
        list.innerHTML = rows.map(r=> `<div class="submitted-cars-list">
          <div class="submitted-car-item"><strong>${r.make} ${r.model}</strong> • ${r.year||'—'}<br><small>${r.sellerName} • ${r.contact}</small><br>Expected: ${moneyGBP(r.expectedPrice||0)} — <em>${r.status}</em></div>
        </div>`).join('');
      }catch{}
    }
    document.getElementById('sellForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const f = new FormData(e.target);
      const data = Object.fromEntries(f.entries());
      data.year = +data.year||null; data.mileage = +data.mileage||null; data.expectedPrice = +data.expectedPrice||null;
      await api.sellCreate(data);
      e.target.reset();
      alert('Submitted! We will contact you soon.');
    });
  }
};

window.FeedbackPage = {
  async init(){
    async function render(){
      const rows = await api.feedbackList();
      document.getElementById('feedbackList').innerHTML = rows.map(r=> `<div class="feedback-item">
        <strong>${r.name}</strong> — ${'★'.repeat(r.rating||5)}${'☆'.repeat(5-(r.rating||5))}<br><small>${r.email||''}</small><p>${r.message}</p>
      </div>`).join('');
    }
    await render();
    document.getElementById('fbForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const f = new FormData(e.target);
      const data = Object.fromEntries(f.entries());
      data.rating = +data.rating||5;
      await api.feedbackCreate(data);
      e.target.reset();
      await render();
      alert('Thanks for your feedback!');
    });
  }
};

window.AdminLogin = {
  init(){
    document.getElementById('loginForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPass').value.trim();
      const res = await api.login(email, password);
      if (res.token){ localStorage.setItem('token', res.token); location.href='admin.html'; }
      else alert(res.message || 'Login failed');
    });
  }
};

window.AdminPage = {
  async init(){
    const listDiv = document.getElementById('carListAdmin');
    const sellDiv = document.getElementById('sellCarSubmissions');
    const fbDiv = document.getElementById('feedbackAdmin');

    async function renderCars(){
      const cars = await api.getCars();
      listDiv.innerHTML = cars.map(c=> `<div class="car-item">
        <span>${c.name||c.make+' '+c.model} • ${c.year||'—'} • ${moneyGBP(c.price)}</span>
        <div><button onclick="AdminPage.editCar('${c._id}')">Edit</button><button onclick="AdminPage.deleteCar('${c._id}')">Delete</button></div>
      </div>`).join('');
    }
    async function renderSell(){
      try{
        const rows = await api.sellList();
        sellDiv.innerHTML = rows.map(r=> `<div class="sell-car-item">
          <h3>${r.make} ${r.model} • ${r.year||'—'} — <small>${r.status}</small></h3>
          <p>${r.sellerName} • ${r.contact} • ${r.email||''}</p>
          <p>Expected: ${moneyGBP(r.expectedPrice||0)} | Color: ${r.color||'—'}</p>
          <div class="actions">
            <button onclick="AdminPage.approveSell('${r._id}')">Approve → Add to Cars</button>
            <button onclick="AdminPage.rejectSell('${r._id}')">Reject</button>
            <button onclick="AdminPage.deleteSell('${r._id}')">Delete</button>
          </div>
        </div>`).join('');
      }catch(e){ sellDiv.innerHTML = '<em>Login to view submissions.</em>'; }
    }
    async function renderFeedback(){
      const rows = await api.feedbackList();
      fbDiv.innerHTML = rows.map(r=> `<div class="car-item">
        <span><strong>${r.name}</strong> — ${'★'.repeat(r.rating||5)}${'☆'.repeat(5-(r.rating||5))} — ${r.message}</span>
        <div><button onclick="AdminPage.deleteFeedback('${r._id}')">Delete</button></div>
      </div>`).join('');
    }

    document.getElementById('carForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const payload = {
        name: document.getElementById('name').value, price: +document.getElementById('price').value,
        year: document.getElementById('year').value? +document.getElementById('year').value:null,
        mileage: document.getElementById('mileage').value? +document.getElementById('mileage').value:null,
        fuel: document.getElementById('fuel').value, transmission: document.getElementById('transmission').value,
        engine: document.getElementById('engine').value, color: document.getElementById('color').value,
        owners: document.getElementById('owners').value? +document.getElementById('owners').value:null,
        condition: document.getElementById('condition').value? +document.getElementById('condition').value:null,
        details: document.getElementById('details').value,
        images: document.getElementById('imageUrl').value ? [document.getElementById('imageUrl').value] : []
      };
      const id = document.getElementById('editId').value;
      if (id) await api.updateCar(id, payload); else await api.addCar(payload);
      e.target.reset(); document.getElementById('editId').value=''; await renderCars(); alert('Saved.');
    });
    document.getElementById('resetBtn').addEventListener('click', ()=> { document.getElementById('carForm').reset(); document.getElementById('editId').value=''; });

    this.editCar = async (id)=>{
      const c = await api.getCar(id);
      document.getElementById('editId').value = c._id;
      document.getElementById('name').value = c.name||''; document.getElementById('price').value = c.price||'';
      document.getElementById('year').value = c.year||''; document.getElementById('mileage').value = c.mileage||'';
      document.getElementById('fuel').value = c.fuel||'Petrol'; document.getElementById('transmission').value = c.transmission||'Automatic';
      document.getElementById('engine').value = c.engine||'1.6L'; document.getElementById('color').value = c.color||'Black';
      document.getElementById('owners').value = c.owners||''; document.getElementById('condition').value = c.condition||'';
      document.getElementById('details').value = c.details||''; document.getElementById('imageUrl').value = (c.images&&c.images[0])||'';
      window.scrollTo({ top: 0, behavior:'smooth' });
    };
    this.deleteCar = async (id)=>{ await api.deleteCar(id); await renderCars(); };
    this.approveSell = async (id)=>{
      const upd = await api.sellUpdate(id, { status:'approved' });
      await api.addCar({
        name: (upd.make||'')+' '+(upd.model||''),
        make: upd.make, model: upd.model, year: upd.year, mileage: upd.mileage, color: upd.color,
        price: upd.expectedPrice||0, fuel:'Petrol', transmission:'Manual', engine:'1.6L',
        details: upd.notes||'', images: ['images/car-placeholder.jpg']
      });
      await renderSell(); await renderCars(); alert('Approved & added to cars.');
    };
    this.rejectSell = async (id)=>{ await api.sellUpdate(id, { status:'rejected' }); await renderSell(); };
    this.deleteSell = async (id)=>{ await api.sellDelete(id); await renderSell(); };
    this.deleteFeedback = async (id)=>{ await api.feedbackDelete(id); await renderFeedback(); };

    await renderCars(); await renderSell(); await renderFeedback();
  }
};
